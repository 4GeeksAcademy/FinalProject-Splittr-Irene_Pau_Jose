"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Expenses, Debts, Objectives, Group, ObjectivesContributions, Messages, Payments, Group_payments, Group_to_user, User_Contacts

from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from datetime import datetime
from api.data import users, groups, group_to_user, group_payments, payments, expenses, debts, messages, objectives, objectives_contributions, user_contacts

#from api import api

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#@api.route("/test", methods=["GET"])
#def test():
#    return jsonify({"message": "API funcionando"})


#GET /users ---> funciona !!
@api.route('/user', methods=['GET']) 
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]  
    return jsonify(users_list), 200


#GET /user --> funciona !!
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404 
    return jsonify(user.serialize()), 200


#POST /users --> NO funciona, NO da ids nuevos diferentes
@api.route('/signup', methods=['POST'])
def add_new_user():
    request_body = request.get_json()
    if "email" not in request_body or "password" not in request_body:
        return jsonify({"msg": "Email and password are required"}), 400
    
    exist = User.query.filter_by(email=request_body["email"]).first()
    if exist:
        return jsonify({"msg":"User already exists"}), 400
   
    new_user =User(email=request_body["email"],name=request_body["name"], password = request_body["password"])
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg":"New user created"}), 201



#DELETE /user --> funciona !!
@api.route('/user/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id) 
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200



#PUT /user_id --> funciona

@api.route('/user/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)  
    if user is None:
        return jsonify({"msg": "User not found"}), 404  

    request_body = request.get_json()
    if not request_body:
        return jsonify({"msg": "No data provided"}), 400

    if "name" in request_body:
        user.name = request_body["name"]
    if "email" in request_body:
        existing_user = User.query.filter_by(email=request_body["email"]).first()
        if existing_user and existing_user.user_id != user_id:
            return jsonify({"msg": "Email already in use"}), 400
        user.email = request_body["email"]
    if "password" in request_body:
        user.password = request_body["password"]

    db.session.commit()

    return jsonify({"msg": "User updated", "user": user.serialize()}), 200



#GET /groups --> funciona !!
@api.route('/group', methods=['GET'])
def get_groups():
    groups = Group.query.all() 
    groups_list = [group.serialize() for group in groups]  
    return jsonify(groups_list)


#GET /group --> funciona !!
@api.route('/group/<int:group_id>', methods=['GET'])
def get_group_by_id(group_id):
    group = Group.query.get(group_id)
    if group is None:
        return jsonify({"error": "Group not found"}), 404 
    return jsonify(group.serialize())



#POST /groups --> funciona, poner los miembros como requeridos. 
@api.route('/group/create', methods=['POST'])
def create_group():
    request_data = request.get_json()
    if "group_name" not in request_data:
        return jsonify({"msg": "Group name is required"}), 400

    new_group = Group(
        group_name=request_data["Group name"],
        created_at=datetime.utcnow()
    )
    
    db.session.add(new_group)
    db.session.commit()

    if "members" in request_data:
        for user_id in request_data["members"]:
            group_to_user = Group_to_user(user_id=user_id, group_id=new_group.group_id, created_at=datetime.utcnow())
            db.session.add(group_to_user)
        
        db.session.commit()

    return jsonify(new_group.serialize()), 201


#DELETE /group --> funciona
@api.route('/group/delete/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
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
def update_group(group_id):
    request_data = request.get_json()
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if "group_name" in request_data:
        group.group_name = request_data["group_name"]

    if "members" in request_data:
        # Borrar los miembros actuales del grupo
        Group_to_user.query.filter_by(group_id=group_id).delete()

        for user_id in request_data["members"]:
            group_to_user = Group_to_user(user_id=user_id, group_id=group_id, created_at=datetime.utcnow())
            db.session.add(group_to_user)

    db.session.commit()

    return jsonify(group.serialize()), 200

#get contactos activos de un usuario 
@api.route('/user_contacts/<int:user_id>', methods=['GET'])
def get_user_contacts(user_id):
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
def add_contact():
    request_data = request.get_json()

    if "user_id" not in request_data or "contact_id" not in request_data:
        return jsonify({"msg": "Both user_id and contact_id are required"}), 400

    user_id = request_data["user_id"]
    contact_id = request_data["contact_id"]

    if user_id == contact_id:
        return jsonify({"msg": "A user cannot add themselves as a contact"}), 400

    user = User.query.get(user_id)
    contact = User.query.get(contact_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    if not contact:
        return jsonify({"msg": "Contact not found"}), 404

    existing_entry = User_Contacts.query.filter_by(user_id=user_id, contact_id=contact_id).first()
    if existing_entry:
        return jsonify({"msg": "User is already a contact"}), 400

    new_contact = User_Contacts(user_id=user_id, contact_id=contact_id, created_at=datetime.utcnow())
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"msg": "Contact added successfully"}), 201


#editar estado de un contacto, activo o inactivo 
@api.route('/user_contacts/<int:user_id>/<int:contact_id>', methods=['PUT'])
def update_contact_status(user_id, contact_id):
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


#delete definitivamente un contacto 
@api.route('/user_contacts/<int:user_id>/<int:contact_id>', methods=['DELETE'])
def hard_delete_contact(user_id, contact_id):
    contact_entry = User_Contacts.query.filter_by(user_id=user_id, contact_id=contact_id).first()

    if not contact_entry:
        return jsonify({"msg": "Contact relationship not found"}), 404

    db.session.delete(contact_entry)
    db.session.commit()

    return jsonify({"msg": "Contact permanently deleted"}), 200


#POST /groups_users funciona
@api.route('/group_user', methods=['POST'])
def add_user_to_group():
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
@api.route('/group_user', methods=['DELETE'])
def remove_user_from_group():
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
def get_payments():
    payments = Payments.query.all()
    payments_info = [payment.serialize() for payment in payments]
    return jsonify(payments_info), 200


#Funciona
@api.route("/payment/<int:id>", methods=["GET"])
def get_payment_by_id(id):
    payment = Payments.query.filter_by(id=id).first()
    
    if not payment:
        return jsonify({"msg": "Payment does not exist"})

    return jsonify(payment.serialize()), 200


#Funciona
@api.route("/create/payment", methods=["POST"])
def create_payment():
    data = request.get_json()

    if "amount" not in data or "payer_id" not in data or "receiver_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_payment = Payments(amount=data["amount"], payer_id=data["payer_id"], receiver_id=data["receiver_id"] )

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({"msg": "Paymnent was successfully done"}), 201

#Funciona
@api.route("/expense", methods=["GET"])
def get_expenses():
    expenses = Expenses.query.all()
    expenses_info = [expense.serialize() for expense in expenses]
    return jsonify(expenses_info), 200

#Funciona
@api.route("/expense/<int:expense_id>", methods=["GET"])
def get_expense_by_id(expense_id):
    expense = Expenses.query.filter_by(expense_id=expense_id).first()
    
    if not expense:
        return jsonify({"msg": "Expense does not exist"})

    return jsonify(expense.serialize()), 200


#Funciona
@api.route("/expense/create", methods=["POST"])
def create_expense():
    data = request.get_json()

    if "amount" not in data or "description" not in data or "shared_between" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_expense = Expenses( amount=data["amount"], description=data["description"], shared_between=data["shared_between"])

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"msg": "Expense was successfully created"}), 201


#Funciona
@api.route("/expense/update/<int:expense_id>", methods=["PUT"])
def update_expense(expense_id):
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
def delete_expense(expense_id):
    expense = Expenses.query.filter_by(expense_id=expense_id).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"msg": "Expense successfully deleted"}), 200


#Funciona
@api.route("/debt", methods=["GET"])
def get_debts():
    debts = Debts.query.all()
    debts_info = [debt.serialize() for debt in debts]
    return jsonify(debts_info), 200


#Funciona
@api.route("/debt/<int:debt_id>", methods=["GET"])
def get_debt_by_id(debt_id):
    debt = Debts.query.filter_by(debt_id=debt_id).first()
    
    if not debt:
        return jsonify({"msg": "Debt does not exist"})

    return jsonify(debt.serialize()), 200



#Funciona
@api.route("/debt/create", methods=["POST"])
def create_debt():
    data = request.get_json()

    if "amount_to_pay" not in data or "debtor_id" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    

    new_debt = Debts(amount_to_pay=data["amount_to_pay"], debtor_id=data["debtor_id"])

    db.session.add(new_debt)
    db.session.commit()

    return jsonify({"msg": "Debt was successfully created"}), 201


#Funciona
@api.route("/debt/update/<int:debt_id>", methods=["PUT"])
def update_debt(debt_id):
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
def delete_debt(debt_id):
    debt = Debts.query.filter_by(debt_id=debt_id).first()

    if not debt:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(debt)
    db.session.commit()

    return jsonify({"msg": "Debt successfully deleted"}), 200



#No funciona
@api.route("/message/<int:sent_to_user_id>", methods=["GET"])
def get_messages_by_id(sent_to_user_id):
    messages = Messages.query.filter_by(sent_to_user_id=sent_to_user_id).all()
    
    if not messages:
        return jsonify({"error": "No messages found"}), 404
    
    user_messages = [message.serialize() for message in messages]

    return jsonify(user_messages), 200


#No funciona
@api.route("/message/send", methods=["POST"])
def send_message():
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
def get_objectives():
    objectives = Objectives.query.all()
    objectives_info = [objective.serialize() for objective in objectives]
    return jsonify(objectives_info), 200



@api.route("/objective/<int:id>", methods=["GET"])
def get_objective_by_id(id):
    objectives = Objectives.query.filter_by(id=id).first()
    
    if not objectives:
        return jsonify({"msg": "Objective does not exist"})

    return jsonify(objectives.serialize()), 200




@api.route("/objective/create", methods=["POST"])
def create_objective():
    data = request.get_json()

    if "name" not in data or "amount" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    existing_objective = Objectives.query.filter_by(name=data["name"]).first()
    if existing_objective:
        return jsonify({"error": "Group is already registered"}), 400

    new_objective = Objectives(name=data["name"], target_amount=data["amount"])

    db.session.add(new_objective)
    db.session.commit()

    return jsonify({"msg": "Group was successfully created"}), 201



@api.route("/objective/delete/<int:id>", methods=["DELETE"])
def delete_objective(id):
    objective = Objectives.query.filter_by(id=id).first()

    if not objective:
        return jsonify({"error": "Objective not found"}), 404
    
    db.session.delete(objective)
    db.session.commit()

    return jsonify({"msg": "Objective successfully deleted"}), 200



@api.route("/objective/update/<int:id>", methods=["PUT"])
def update_objective(id):
    objective = Objectives.query.filter_by(id=id).first()
    
    if not objective:
        return jsonify({"error": "Objective not found"}), 404
    
    data = request.get_json()

    if "name" in data:
        objective.name = data["name"]
    if "amount" in data:
        objective.email = data["amount"]
    
    db.session.commit()
    return jsonify({"msg" : "Objective was successfully updated"}), 200




@api.route("/objective/contribution", methods=["POST"])
def objective_contribution():
    data = request.get_json()

   
    if "objective" not in data or "amount" not in data or "user" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    
    objective = Objectives.query.filter_by(id=data["objective"]).first()
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    
    total_contributed = db.session.query(db.func.sum(ObjectivesContributions.amount_contributed)).filter_by(objectiveID=data["objective"]).scalar()
    print(total_contributed)
    
    total_contributed = total_contributed or 0  

  
    if total_contributed + data["amount"] > objective.target_amount:
        return jsonify({"error": "Contribution exceeds target amount"}), 400

  
    contribution = ObjectivesContributions(amount_contributed=data["amount"], user_id=data["user"], objectiveID=data["objective"])

    db.session.add(contribution)
    db.session.commit()

    return jsonify({"msg": "Contribution was successfully added"}), 201



# Routes to populate the database #

@api.route("/userpopulate", methods=["GET"])
def user_populate():
    for user in users:
        new_user = User(user_id=user["user_id"], name=user["name"], email=user["email"], password=user["password"])
        db.session.add(new_user)
    db.session.commit()
    return jsonify("Users have been created")

@api.route("/grouppopulate", methods=["GET"])
def group_populate():
    for group in groups:
        new_group = Group(group_id=group["group_id"], group_name=group["group_name"], created_at=group["created_at"], total_amount=group["total_amount"])
        db.session.add(new_group)
    db.session.commit()
    return jsonify("Groups have been created")


@api.route("/grouptouserpopulate", methods=["GET"])
def group_to_user_populate():
    for group in group_to_user:
        new_group_to_user = Group_to_user(id=group["id"],user_id=group["user_id"], group_id=group["group_id"], created_at=group["created_at"])
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
        new_group_payments = Group_payments(id=group["id"],receiver_id=group["receiver_id"], payer_id=group["payer_id"], group_id=group["group_id"], amount=group["amount"], payed_at=group["payed_at"])
        db.session.add(new_group_payments)
    db.session.commit()
    return jsonify("Group_payments have been created")


@api.route("/paymentspopulate", methods=["GET"])
def payments_populate():
    for payment in payments:
        new_payments = Payments(id=payment["id"], payer_id=payment["payer_id"], receiver_id=payment["receiver_id"], amount=payment["amount"], payed_at=payment["payed_at"])
        #No deja meter el debtID=payment["debtID"], sqlalchemy.exc.IntegrityError: (psycopg2.errors.UniqueViolation) duplicate key value violates unique constraint "payments_pkey" DETAIL:  Key (id)=(2) already exists.

        db.session.add(new_payments)
    db.session.commit()
    return jsonify("Payments have been created")

@api.route("/expensespopulate", methods=["GET"])
def expenses_populate():
    for expense in expenses:
        new_expense = Expenses(expense_id=expense["expense_id"], payer_id=expense["payer_id"], shared_between=expense["shared_between"], amount=expense["amount"], description=expense["description"], created_at=expense["created_at"])
        #En este da problema  group_id=expense["group_id"], dice que no es un int like
        db.session.add(new_expense)
    db.session.commit()
    return jsonify("Expenses have been created")

@api.route("/debtspopulate", methods=["GET"])
def debts_populate():
    for debt in debts:
        new_debt = Debts(debt_id=debt["debt_id"], expenses_id=debt["expenses_id"], debtor_id=debt["debtor_id"], amount_to_pay=debt["amount_to_pay"], is_paid=debt["is_paid"], payed_at=debt["payed_at"])
        #
        db.session.add(new_debt)
    db.session.commit()
    return jsonify("Debts have been created")

@api.route("/messagespopulate", methods=["GET"])
def messages_populate():
    for message in messages:
        new_message = Messages(id=message["id"], from_user_id=message["from_user_id"],  message=message["message"], sent_at=message["sent_at"])
        #
        db.session.add(new_message)
    db.session.commit()
    return jsonify("Messages have been created")

@api.route("/objectivespopulate", methods=["GET"])
def objectives_populate():
    for objective in objectives:
        new_objective = Objectives(id=objective["id"], group_id=objective["group_id"], name=objective["name"], target_amount=objective["target_amount"], created_at=objective["created_at"], is_completed=objective["is_completed"])
        #
        db.session.add(new_objective)
    db.session.commit()
    return jsonify("Objectives have been created")

@api.route("/objectivescontributionspopulate", methods=["GET"])
def objectives_contributions_populate():
    for objective in objectives_contributions:
        new_objectives_contribution = ObjectivesContributions(id=objective["id"], objective_id=objective["objective_id"], user_id=objective["user_id"], amount_contributed=objective["amount_contributed"], contributed_at=objective["contributed_at"])
        #
        db.session.add(new_objectives_contribution)
    db.session.commit()
    return jsonify("Objectives Contributions have been created")

