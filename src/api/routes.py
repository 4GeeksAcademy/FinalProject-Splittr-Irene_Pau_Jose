"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Expenses, Debts, Objectives, Group, ObjectivesContributions, Messages, Payments, Group_payments, Group_to_user, User_Contacts, Group_debts, Feedback

from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from datetime import datetime
from api.data import users, groups, group_to_user, group_payments, payments, expenses, debts, messages, objectives, objectives_contributions, user_contacts, group_debts;


from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
#from api import api

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#@api.route("/test", methods=["GET"])
#def test():
#    return jsonify({"message": "API funcionando"})

@api.route('/signup', methods=['POST'])
def add_new_user():
    request_body = request.get_json()
    if "email" not in request_body or "password" not in request_body or "name" not in request_body:
        return jsonify({"msg": "Please fill all fields"}), 400
    
    exist = User.query.filter_by(email=request_body["email"]).first()
    if exist:
        return jsonify({"msg":"Email already exists"}), 401
   
    new_user =User(email=request_body["email"],name=request_body["name"], password = request_body["password"])
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize(), {"msg":"New user created"}), 201


@api.route("/login", methods=["POST"])
def handle_login():
    email= request.json.get("email", None)
    password= request.json.get("password", None)    

    user = User.query.filter_by(email = email, password=password).first()

    if user is None:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.user_id))
    return jsonify({"token" : access_token, "user_id": user.user_id})




#GET /users ---> funciona !!
@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()  
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    users = User.query.all()
    users_list = [user.serialize() for user in users]  

    return jsonify(users_list), 200

#GET /user --> funciona !!
@api.route('/user', methods=['GET'])
@jwt_required()
def get_user_by_id():
    current_user_id = get_jwt_identity()  
    user = User.query.get(current_user_id)
    
    if user is None:
        return jsonify({"error": "User not found"}), 404 
    return jsonify(user.serialize()), 200


@api.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_its_id(user_id):
    user = User.query.get(user_id)
    
    if user is None:
        return jsonify({"error": "User not found"}), 404 
    return jsonify(user.serialize()), 200


#DELETE /user --> funciona !!
@api.route('/user/delete/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()  
    user = User.query.get(current_user_id)  

    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    user = User.query.get(user_id) 
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200



#PUT /user_id --> funciona
@api.route('/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    current_user_id = get_jwt_identity()  
    user = User.query.get(current_user_id)  

    if user is None:
        return jsonify({"msg": "User not found"}), 404  

    request_body = request.get_json()
    if not request_body:
        return jsonify({"msg": "No data provided"}), 400

  
    if "name" in request_body:
        user.name = request_body["name"]
    if "email" in request_body:
        existing_user = User.query.filter_by(email=request_body["email"]).first()
        if existing_user and existing_user.user_id != current_user_id:
            return jsonify({"msg": "Email already in use"}), 400
        user.email = request_body["email"]
    if "password" in request_body:
        user.password = request_body["password"]
    if "birthday" in request_body: 
        try:
            user.birthday = datetime.strptime(request_body["birthday"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD."}), 400

    db.session.commit()

    return jsonify({"msg": "User updated", "user": user.serialize()}), 200



#GET /groups --> funciona !!
@api.route('/group', methods=['GET'])
@jwt_required()
def get_groups():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    if user is None:
        return jsonify({"msg": "User not found"}), 400
    groups = Group.query.all() 
    groups_list = [group.serialize() for group in groups]  
    return jsonify(groups_list)


#GET /group --> funciona !!
@api.route('/group/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group_by_id(group_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    group = Group.query.get(group_id)
    if group is None:
        return jsonify({"error": "Group not found"}), 404 
    return jsonify(group.serialize())


@api.route('/group/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_group_by_user_id(user_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    group_membership = Group_to_user.query.filter_by(user_id=user_id).all()

    if not group_membership:
        return jsonify({"error": "User is not in any groups"}), 404 
    
    group_ids = [membership.group_id for membership in group_membership]

    groups = Group.query.filter(Group.group_id.in_(group_ids)).all()

    return jsonify([group.serialize() for group in groups]), 200


#POST /groups --> funciona, poner los miembros como requeridos. 
@api.route('/group/create', methods=['POST'])
@jwt_required()
def create_group():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    request_data = request.get_json()
    if "group_name" not in request_data:
        return jsonify({"msg": "Group name is required"}), 400

    new_group = Group(
        group_name=request_data["group_name"],
        created_at=datetime.utcnow()
    )

    db.session.add(new_group)
    db.session.commit()

    group_to_user_creator = Group_to_user(user_id=current_user_id, group_id=new_group.group_id, created_at=datetime.utcnow())
    db.session.add(group_to_user_creator)

    if "members" in request_data:
        for user_id in request_data["members"]:
            group_to_user = Group_to_user(user_id=user_id, group_id=new_group.group_id, created_at=datetime.utcnow())
            db.session.add(group_to_user)

    db.session.commit()

    return jsonify(new_group.serialize()), 201


#DELETE /group --> funciona
@api.route('/group/delete/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_group(group_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404
    
    group_to_user_entries = Group_to_user.query.filter_by(group_id=group_id).all()
    for entry in group_to_user_entries:
        db.session.delete(entry)
    
    db.session.delete(group)
    db.session.commit()

    return jsonify({"msg": "Group deleted"}), 200


#PUT /group_id --> funciona
@api.route('/group/update/<int:group_id>', methods=['PUT'])
@jwt_required()
def update_group(group_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    request_data = request.get_json()
    print("Received update request:", request_data)  # ✅ Debugging log

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if "group_name" in request_data:
        group.group_name = request_data["group_name"]
    
    if "total_amount" in request_data:
        group.total_amount = request_data["total_amount"]

    db.session.commit()
    return jsonify(group.serialize()), 200

@api.route('/group/group_debts/<int:group_id>', methods=['GET'])
@jwt_required()  
def get_group_debts(group_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401 
    
    debts = Group_debts.query.filter_by(group_id=group_id).all()
    
    if not debts:
        return jsonify({"error": "No debts found for this group"}), 404

    debt_list = [debt.serialize() for debt in debts]

    return jsonify(debt_list)



#get contactos activos de un usuario 
@api.route('/user_contacts/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_contacts(user_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    contacts = User_Contacts.query.filter_by(user_id=user_id, is_active=True).all()
    
    return jsonify({
        "user_id": user_id,
        "contacts": [contact.serialize() for contact in contacts]
    }), 200


#añadir un contacto 
@api.route('/user_contacts', methods=['POST'])
@jwt_required()
def add_contact():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    request_data = request.get_json()
    
    if "contact_email" not in request_data:
        return jsonify({"msg": "contact_email is required"}), 400
    
    contact_email = request_data["contact_email"]
    
    # Check if the contact email is the same as the current user's email
    if contact_email.lower() == user.email.lower():
        return jsonify({"msg": "A user cannot add themselves as a contact"}), 400
    
    contact = User.query.filter_by(email=contact_email).first()
    
    if not contact:
        return jsonify({"msg": "Contact not found"}), 404
    
    existing_entry = User_Contacts.query.filter_by(user_id=current_user_id, contact_id=contact.user_id).first()
    
    if existing_entry:
        return jsonify({"msg": "User is already a contact"}), 400
    
    new_contact = User_Contacts(user_id=current_user_id, contact_id=contact.user_id, created_at=datetime.utcnow())
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({"msg": "Contact added successfully"}), 201


@api.route('/singlecontact/<int:contact_id>', methods=['GET'])
@jwt_required()
def get_single_contact(contact_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    contact = User_Contacts.query.filter_by(user_id=current_user_id, contact_id=contact_id, is_active=True).first()
    
    if not contact:
        return jsonify({"msg": "Contact not found"}), 404

    return jsonify(contact.serialize()), 200



#editar estado de un contacto, activo o inactivo 
@api.route('/user_contacts/<int:contact_id>', methods=['PUT'])
@jwt_required()
def update_contact_status(user_id, contact_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    request_data = request.get_json()

    if "is_active" not in request_data:
        return jsonify({"msg": "is_active field is required"}), 400

    contact_entry = User_Contacts.query.filter_by(user_id=user_id, contact_id=contact_id).first()

    if not contact_entry:
        return jsonify({"msg": "Contact relationship not found"}), 404

    contact_entry.is_active = request_data["is_active"]
    db.session.commit()

    status = "activated" if contact_entry.is_active else "deactivated"

    return jsonify({
        "msg": f"Contact {status} successfully",
        "user_id": user_id,
        "contact_id": contact_id,
        "is_active": contact_entry.is_active
    }), 200


#delete definitivamente un contacto, funciona, hace falta solo poner el id de la relación de contacto en el link
@api.route('/user_contacts/<int:contact_id>', methods=['DELETE'])
@jwt_required()
def hard_delete_contact(contact_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    contact_entry = User_Contacts.query.filter_by(user_id=current_user_id, contact_id=contact_id).first()

    if not contact_entry:
        return jsonify({"msg": "Contact relationship not found"}), 404

    db.session.delete(contact_entry)
    db.session.commit()

    return jsonify({"msg": "Contact permanently deleted"}), 200



#POST /groups_users funciona
@api.route('/group_user', methods=['POST'])
@jwt_required()
def add_user_to_group():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    request_data = request.get_json()


    if "user_id" not in request_data or "group_id" not in request_data:
        return jsonify({"msg": "Both user_id and group_id are required"}), 400
    
    user_id = request_data["user_id"]
    group_id = request_data["group_id"]

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    existing_entry = Group_to_user.query.filter_by(user_id=user_id, group_id=group_id).first()
    if existing_entry:
        return jsonify({"msg": "User is already in the group"}), 400

    new_group_user = Group_to_user(user_id=user_id, group_id=group_id, created_at=datetime.utcnow())
    db.session.add(new_group_user)
    db.session.commit()

    return jsonify({"msg": "User added to group successfully"}), 201



#DELETE /groups_users funciona
@api.route('/group_user/delete', methods=['DELETE'])
@jwt_required()
def remove_user_from_group():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    request_data = request.get_json()

    if "user_id" not in request_data or "group_id" not in request_data:
        return jsonify({"msg": "Both user_id and group_id are required"}), 400

    user_id = request_data["user_id"]
    group_id = request_data["group_id"]

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    group_to_user_entry = Group_to_user.query.filter_by(user_id=user_id, group_id=group_id).first()
    if not group_to_user_entry:
        return jsonify({"msg": "User is not part of the group"}), 400

    db.session.delete(group_to_user_entry)
    db.session.commit()

    return jsonify({"msg": "User removed from group successfully"}), 200





#Funciona
@api.route("/payment", methods=["GET"])
@jwt_required()
def get_payments():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    payments = Payments.query.all()
    payments_info = [payment.serialize() for payment in payments]
    return jsonify(payments_info), 200


#Funciona
@api.route("/payment/<int:id>", methods=["GET"])
@jwt_required()
def get_payment_by_id(id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    payment = Payments.query.filter_by(id=id).first()
    
    if not payment:
        return jsonify({"msg": "Payment does not exist"})

    return jsonify(payment.serialize()), 200


#Funciona
@api.route("/payment/create", methods=["POST"])
@jwt_required()
def create_payment():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "amount" not in data or "payer_id" not in data or "receiver_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_payment = Payments(amount=data["amount"], payer_id=data["payer_id"], receiver_id=data["receiver_id"] )

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({"msg": "Paymnent was successfully done"}), 201

#Funciona
@api.route("/expense", methods=["GET"])
@jwt_required()
def get_expenses():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    expenses = Expenses.query.all()
    expenses_info = [expense.serialize() for expense in expenses]
    return jsonify(expenses_info), 200

#Funciona
@api.route("/expense/<int:expense_id>", methods=["GET"])
@jwt_required()
def get_expense_by_id(expense_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    expense = Expenses.query.filter_by(expense_id=expense_id).first()
    
    if not expense:
        return jsonify({"msg": "Expense does not exist"})

    return jsonify(expense.serialize()), 200


#Funciona
@api.route("/expense/create", methods=["POST"])
@jwt_required()
def create_expense():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "amount" not in data or "description" not in data or "shared_between" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_expense = Expenses( amount=data["amount"], description=data["description"], shared_between=data["shared_between"])

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"msg": "Expense was successfully created"}), 201


#Funciona
@api.route("/expense/update/<int:expense_id>", methods=["PUT"])
@jwt_required()
def update_expense(expense_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    expense = Expenses.query.filter_by(expense_id=expense_id).first()
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    data = request.get_json()

    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    expense.amount = data["amount"]

    db.session.commit()  

    return jsonify({"msg": "Expense was successfully updated", "expense": expense.serialize()}), 200



#Funciona
@api.route("/expense/delete/<int:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense(expense_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    expense = Expenses.query.filter_by(expense_id=expense_id).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"msg": "Expense successfully deleted"}), 200


#Funciona
@api.route("/debt", methods=["GET"])
@jwt_required()
def get_debts():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    debts = Debts.query.all()
    debts_info = [debt.serialize() for debt in debts]
    return jsonify(debts_info), 200


#Funciona
@api.route("/debt/<int:debt_id>", methods=["GET"])
@jwt_required()
def get_debt_by_id(debt_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    debt = Debts.query.filter_by(debt_id=debt_id).first()
    
    if not debt:
        return jsonify({"msg": "Debt does not exist"})

    return jsonify(debt.serialize()), 200



#Funciona
@api.route("/debt/create", methods=["POST"])
@jwt_required()
def create_debt():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "amount_to_pay" not in data or "debtor_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    

    new_debt = Debts(amount_to_pay=data["amount_to_pay"], debtor_id=data["debtor_id"])

    db.session.add(new_debt)
    db.session.commit()

    return jsonify({"msg": "Debt was successfully created"}), 201


#Funciona
@api.route("/debt/update/<int:debt_id>", methods=["PUT"])
@jwt_required()
def update_debt(debt_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    debt = Debts.query.filter_by(debt_id=debt_id).first()
    
    if not debt:
        return jsonify({"error": "Debt not found"}), 404
    
    data = request.get_json()

    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    debt.amount_to_pay = data["amount"]

    db.session.commit()  

    return jsonify({"msg": "Expense was successfully updated", "debt": debt.serialize()}), 200



#Funciona
@api.route("/debt/delete/<int:debt_id>", methods=["DELETE"])
@jwt_required()
def delete_debt(debt_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    debt = Debts.query.filter_by(debt_id=debt_id).first()

    if not debt:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(debt)
    db.session.commit()

    return jsonify({"msg": "Debt successfully deleted"}), 200



#No funciona
@api.route("/message/<int:sent_to_user_id>", methods=["GET"])
@jwt_required()
def get_messages_by_id(sent_to_user_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    messages = Messages.query.filter_by(sent_to_user_id=sent_to_user_id).all()
    
    if not messages:
        return jsonify({"error": "No messages found"}), 404
    
    user_messages = [message.serialize() for message in messages]

    return jsonify(user_messages), 200


@api.route('/message/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_messages_by_user_id(user_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    received_messages = Messages.query.filter_by(sent_to_user_id=user_id).all()

    sent_messages = Messages.query.filter_by(from_user_id=user_id).all()

    messages = received_messages + sent_messages
    messages.sort(key=lambda msg: msg.sent_at if msg.sent_at is not None else datetime.min, reverse=True)

    if not messages:
        return jsonify({"error": "No messages found for this user"}), 404 

    messages.sort(key=lambda msg: msg.sent_at, reverse=True)

    return jsonify([message.serialize() for message in messages]), 200


@api.route('/message/conversation/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  
    
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    messages = Messages.query.filter(
        ((Messages.sent_to_user_id == current_user_id) & (Messages.from_user_id == other_user_id)) |
        ((Messages.sent_to_user_id == other_user_id) & (Messages.from_user_id == current_user_id))
    ).order_by(Messages.sent_at).all()

    if not messages:
        return jsonify({"error": "No messages found between these users"}), 404

    return jsonify([message.serialize() for message in messages]), 200




#No funciona
@api.route("/message/send", methods=["POST"])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "sent_to_user_id" not in data or "message" not in data or "from_user_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    to_user = User.query.get(data["sent_to_user_id"])
    from_user = User.query.get(data["from_user_id"])

    if not to_user or not from_user:
        return jsonify({"error": "User not found"}), 404

    new_message = Messages(sent_to_user_id=data["sent_to_user_id"], message=data["message"], from_user_id=data["from_user_id"])

    db.session.add(new_message)
    db.session.commit()

    return jsonify({"msg": "Message was successfully sent"}), 201





@api.route("/objective", methods=["GET"])
@jwt_required()
def get_objectives():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    objectives = Objectives.query.all()
    objectives_info = [objective.serialize() for objective in objectives]
    return jsonify(objectives_info), 200




@api.route("/objective/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_objectives_by_user_id(user_id):
    current_user_id = get_jwt_identity()
    
    if not User.query.get(current_user_id):
        return jsonify({"msg": "You need to be logged in"}), 401

    group_membership = Group_to_user.query.filter(Group_to_user.user_id == user_id).all()
    
    if not group_membership:
        return jsonify({"msg": "User is not in any groups"}), 404

    group_ids = [membership.group_id for membership in group_membership]

    objectives = Objectives.query.filter(Objectives.group_id.in_(group_ids)).all()

    return jsonify([objective.serialize() for objective in objectives]), 200


@api.route("/objective/<int:objective_id>", methods=["GET"])
@jwt_required()
def get_objective_by_id(objective_id):
    current_user_id = get_jwt_identity()
    
    if not User.query.get(current_user_id):
        return jsonify({"msg": "You need to be logged in"}), 401
    
    objective = Objectives.query.get(objective_id)
    
    if not objective:
        return jsonify({"error": "Objective not found"}), 404
    
    group = Group.query.get(objective.group_id)
    
    user_membership = Group_to_user.query.filter_by(
        user_id=current_user_id, 
        group_id=objective.group_id
    ).first()
    
    if not user_membership:
        return jsonify({"error": "You don't have permission to view this objective"}), 403
    
    return jsonify(objective.serialize()), 200


@api.route("/objective/create", methods=["POST"])
@jwt_required()
def create_objective():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "name" not in data or "target_amount" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    existing_objective = Objectives.query.filter_by(name=data["name"]).first()
    if existing_objective:
        return jsonify({"error": "Objective is already registered"}), 400

    new_objective = Objectives(name=data["name"], target_amount=data["target_amount"])

    db.session.add(new_objective)
    db.session.commit()

    return jsonify({"msg": "Objective was successfully created"}), 201



@api.route("/objective/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_objective(id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    objective = Objectives.query.filter_by(id=id).first()

    if not objective:
        return jsonify({"error": "Objective not found"}), 404
    
    db.session.delete(objective)
    db.session.commit()

    return jsonify({"msg": "Objective successfully deleted"}), 200



@api.route("/objective/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_objective(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    objective = Objectives.query.filter_by(id=id).first()
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    data = request.get_json()
    if "name" in data:
        objective.name = data["name"]
    if "target_amount" in data:
        objective.target_amount = data["target_amount"]

    db.session.commit()
    return jsonify({"msg": "Objective was successfully updated"}), 200




@api.route("/objective/contribution", methods=["POST"])
@jwt_required()
def objective_contribution():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    data = request.get_json()

    if "objective" not in data or "amount" not in data or "user" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    objective = Objectives.query.filter_by(id=data["objective"]).first()
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    total_contributed = db.session.query(db.func.sum(ObjectivesContributions.amount_contributed)).filter_by(objective_id=data["objective"]).scalar()
    print(total_contributed)

    total_contributed = total_contributed or 0  

    if total_contributed + data["amount"] > objective.target_amount:
        return jsonify({"error": "Contribution exceeds target amount"}), 400
    
    if objective.is_completed:
        return jsonify({"error": "Objective is already completed"}), 400

    contribution = ObjectivesContributions(amount_contributed=data["amount"], user_id=data["user"], objective_id=data["objective"])

    db.session.add(contribution)
    db.session.commit()

    return jsonify({"msg": "Contribution was successfully added"}), 201


@api.route("/objective/contribution/<int:objective_id>", methods=["GET"])
@jwt_required()
def get_objective_contributions(objective_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    contributions = ObjectivesContributions.query.filter_by(objective_id=objective_id).all()

    if not contributions:
        return jsonify({"error": "No contributions found for this objective"}), 404

    contribution_list = [contribution.serialize() for contribution in contributions]

    return jsonify(contribution_list), 200



@api.route('/transaction/user/', methods=['GET'])
@jwt_required()
def get_user_transactions():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401

    sent_payments = Payments.query.filter_by(payer_id=current_user_id).all()
    received_payments = Payments.query.filter_by(receiver_id=current_user_id).all()
    group_payments = Group_payments.query.filter(
        (Group_payments.payer_id == current_user_id) | (Group_payments.receiver_id == current_user_id)
    ).all()
    contributions = ObjectivesContributions.query.filter_by(user_id=current_user_id).all()

    return jsonify({
        "sent_payments": [payment.serialize() for payment in sent_payments],
        "received_payments": [payment.serialize() for payment in received_payments],
        "group_payments": [gp.serialize() for gp in group_payments],
        "objective_contributions": [contribution.serialize() for contribution in contributions]
    }), 200


@api.route("/feedback", methods=["POST"])
def submit_feedback():
    data = request.get_json()

    if not data or "email" not in data or "message" not in data:
        return jsonify({"error": "Missing email or message"}), 400

    new_feedback = Feedback(email=data["email"], message=data["message"])
    
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"msg": "Feedback submitted successfully"}), 201


# Routes to populate the database #

@api.route("/userpopulate", methods=["GET"])
def user_populate():
    for user in users:
        new_user = User( name=user["name"], email=user["email"], password=user["password"])
        db.session.add(new_user)
    db.session.commit()
    return jsonify("Users have been created")

@api.route("/grouppopulate", methods=["GET"])
def group_populate():
    for group in groups:
        new_group = Group(group_name=group["group_name"], created_at=group["created_at"], total_amount=group["total_amount"])
        db.session.add(new_group)
    db.session.commit()
    return jsonify("Groups have been created")


@api.route("/grouptouserpopulate", methods=["GET"])
def group_to_user_populate():
    for group in group_to_user:
        new_group_to_user = Group_to_user(user_id=group["user_id"], group_id=group["group_id"], created_at=group["created_at"])
        db.session.add(new_group_to_user)
    db.session.commit()
    return jsonify("Groups_to_user have been created")

@api.route("/usercontactspopulate", methods=["GET"])
def user_contacts_populate():
    for contact in user_contacts:
        new_contact = User_Contacts(
            user_id=contact["user_id"],
            contact_id=contact["contact_id"],
            created_at=contact["created_at"]
        )
        db.session.add(new_contact)

    db.session.commit()
    return jsonify("User_contacts have been populated")

@api.route("/grouppaymentspopulate", methods=["GET"])
def group_payments_populate():
    for group in group_payments:
        new_group_payments = Group_payments(receiver_id=group["receiver_id"], payer_id=group["payer_id"], group_id=group["group_id"], amount=group["amount"], payed_at=group["payed_at"])
        db.session.add(new_group_payments)
    db.session.commit()
    return jsonify("Group_payments have been created")

@api.route("/groupdebtspopulate", methods=["GET"])
def group_debts_populate():
    for debt in group_debts:
        new_group_debt = Group_debts(
            debtor_id=debt["debtor_id"],
            creditor_id=debt["creditor_id"],
            group_id=debt["group_id"],
            amount=debt["amount"],
            payed_at=debt["payed_at"],
            is_paid=debt["is_paid"]
        )
        db.session.add(new_group_debt)
    db.session.commit()
    return jsonify("Group_debts have been created")



@api.route("/paymentspopulate", methods=["GET"])
def payments_populate():
    for payment in payments:
        new_payments = Payments(payer_id=payment["payer_id"], receiver_id=payment["receiver_id"], amount=payment["amount"], payed_at=payment["payed_at"])

        db.session.add(new_payments)
    db.session.commit()
    return jsonify("Payments have been created")

@api.route("/expensespopulate", methods=["GET"])
def expenses_populate():
    for expense in expenses:
        new_expense = Expenses( payer_id=expense["payer_id"], shared_between=expense["shared_between"], amount=expense["amount"], description=expense["description"], created_at=expense["created_at"])
        #En este da problema  group_id=expense["group_id"], dice que no es un int like
        db.session.add(new_expense)
    db.session.commit()
    return jsonify("Expenses have been created")

@api.route("/debtspopulate", methods=["GET"])
def debts_populate():
    for debt in debts:
        new_debt = Debts( expenses_id=debt["expenses_id"], debtor_id=debt["debtor_id"], amount_to_pay=debt["amount_to_pay"], is_paid=debt["is_paid"], payed_at=debt["payed_at"])
        #
        db.session.add(new_debt)
    db.session.commit()
    return jsonify("Debts have been created")

@api.route("/messagespopulate", methods=["GET"])
def messages_populate():
    for message in messages:
        new_message = Messages( from_user_id=message["from_user_id"],  message=message["message"], sent_at=message["sent_at"], sent_to_user_id=message["sent_to_user_id"])
        #
        db.session.add(new_message)
    db.session.commit()
    return jsonify("Messages have been created")

@api.route("/objectivespopulate", methods=["GET"])
def objectives_populate():
    for objective in objectives:
        new_objective = Objectives( group_id=objective["group_id"], name=objective["name"], target_amount=objective["target_amount"], created_at=objective["created_at"], is_completed=objective["is_completed"])
        #
        db.session.add(new_objective)
    db.session.commit()
    return jsonify("Objectives have been created")

@api.route("/objectivescontributionspopulate", methods=["GET"])
def objectives_contributions_populate():
    for objective in objectives_contributions:
        new_objectives_contribution = ObjectivesContributions(objective_id=objective["objective_id"], user_id=objective["user_id"], amount_contributed=objective["amount_contributed"], contributed_at=objective["contributed_at"])
        #
        db.session.add(new_objectives_contribution)
    db.session.commit()
    return jsonify("Objectives Contributions have been created")

