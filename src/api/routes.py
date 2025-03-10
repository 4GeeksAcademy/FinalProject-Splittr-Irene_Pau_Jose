"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Expenses, Debts, Objectives, Group, ObjectivesContributions, Messages, Payments
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, User, Group, Group_to_user, Payments
from datetime import datetime
#from api import api

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

#@api.route("/test", methods=["GET"])
#def test():
#    return jsonify({"message": "API funcionando"})

@api.route("/expenses", methods=["GET"])
def get_expenses():
    expenses = Expenses.query.all()
    expenses_info = [expense.serialize() for expense in expenses]
    return jsonify(expenses_info), 200


@api.route("/expense/<int:expenseID>", methods=["GET"])
def get_expense_by_id(expenseID):
    expense = Expenses.query.filter_by(expenseID=expenseID).first()
    
    if not expense:
        return jsonify({"msg": "Expense does not exist"})

    return jsonify(expense.serialize()), 200



@api.route("/expense/create", methods=["POST"])
def create_expense():
    data = request.get_json()

    if "amount" not in data or "description" not in data or "shared_between" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_expense = Expenses( amount=data["amount"], description=data["description"], shared_between=data["shared_between"])

    db.session.add(new_expense)
    db.session.commit()

    return jsonify({"msg": "Expense was successfully created"}), 201



@api.route("/expense/update/<int:expenseID>", methods=["PUT"])
def update_expense(expenseID):
    expense = Expenses.query.filter_by(expenseID=expenseID).first()
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    data = request.get_json()

    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    expense.amount = data["amount"]

    db.session.commit()  

    return jsonify({"msg": "Expense was successfully updated", "expense": expense.serialize()}), 200




@api.route("/expense/delete/<int:expenseID>", methods=["DELETE"])
def delete_expense(expenseID):
    expense = Expenses.query.filter_by(expenseID=expenseID).first()

    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(expense)
    db.session.commit()

    return jsonify({"msg": "Objective successfully deleted"}), 200



@api.route("/debts", methods=["GET"])
def get_debts():
    debts = Debts.query.all()
    debts_info = [debt.serialize() for debt in debts]
    return jsonify(debts_info), 200



@api.route("/debt/<int:debtID>", methods=["GET"])
def get_debt_by_id(debtID):
    debt = Debts.query.filter_by(debtID=debtID).first()
    
    if not debt:
        return jsonify({"msg": "Debt does not exist"})

    return jsonify(debt.serialize()), 200




@api.route("/create/debt", methods=["POST"])
def create_debt():
    data = request.get_json()

    if "amount" not in data or "debtor" not in data:
        return jsonify({"error": "Missing required fields"}), 400
    

    new_debt = Debts(amount_to_pay=data["amount"], debtorID=data["debtor"])

    db.session.add(new_debt)
    db.session.commit()

    return jsonify({"msg": "Debt was successfully created"}), 201


@api.route("/debt/update/<int:debtID>", methods=["PUT"])
def update_debt(debtID):
    debt = Debts.query.filter_by(debtID=debtID).first()
    
    if not debt:
        return jsonify({"error": "Debt not found"}), 404
    
    data = request.get_json()

    if "amount" not in data:
        return jsonify({"error": "Missing required field: amount"}), 400

    debt.amount_to_pay = data["amount"]

    db.session.commit()  

    return jsonify({"msg": "Expense was successfully updated", "debt": debt.serialize()}), 200




@api.route("/debt/delete/<int:debtID>", methods=["DELETE"])
def delete_debt(debtID):
    debt = Debts.query.filter_by(debtID=debtID).first()

    if not debt:
        return jsonify({"error": "Expense not found"}), 404
    
    db.session.delete(debt)
    db.session.commit()

    return jsonify({"msg": "Debt successfully deleted"}), 200



@api.route("/payments", methods=["GET"])
def get_payments():
    payments = Payments.query.all()
    payments_info = [payment.serialize() for payment in payments]
    return jsonify(payments_info), 200


@api.route("/payment/<int:id>", methods=["GET"])
def get_payment_by_id(id):
    payment = Payments.query.filter_by(id=id).first()
    
    if not payment:
        return jsonify({"msg": "Payment does not exist"})

    return jsonify(payment.serialize()), 200



@api.route("/create/payment", methods=["POST"])
def create_payment():
    data = request.get_json()

    if "amount" not in data or "payer" not in data or "receiver" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    new_payment = Payments(amount=data["amount"], payerID=data["payer"], receiverID=data["receiver"] )

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({"msg": "Paymnent was successfully done"}), 201






@api.route("/objectives", methods=["GET"])
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




@api.route("/create/objective", methods=["POST"])
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




@api.route("/objective/contributions", methods=["POST"])
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

  
    contribution = ObjectivesContributions(amount_contributed=data["amount"], userID=data["user"], objectiveID=data["objective"])

    db.session.add(contribution)
    db.session.commit()

    return jsonify({"msg": "Contribution was successfully added"}), 201



@api.route("/messages/<int:sent_to_userid>", methods=["GET"])
def get_messages_by_id(sent_to_userid):
    messages = Messages.query.filter_by(sent_to_userid=sent_to_userid).all()
    
    if not messages:
        return jsonify({"error": "No messages found"}), 404
    
    user_messages = [message.serialize() for message in messages]

    return jsonify(user_messages), 200



@api.route("/send/message", methods=["POST"])
def send_message():
    data = request.get_json()

    if "to_user" not in data or "message" not in data or "from_user":
        return jsonify({"error": "Missing required fields"}), 400

    new_message = Messages(sent_to_userid=data["to_user"], message=data["message"], from_userid=data["from_user"])

    db.session.add(new_message)
    db.session.commit()

    return jsonify({"msg": "Message was successfully sent"}), 201


#GET /users ---> funciona
@api.route('/users', methods=['GET']) 
def get_all_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]  
    return jsonify(users_list), 200


#GET /user --> funciona
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404 
    return jsonify(user.serialize()), 200


#POST /users --> funciona 
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



#DELETE /user --> funciona
@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id) 
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200



#PUT /user_id --> funciona

@api.route('/users/<int:user_id>', methods=['PUT'])
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
        if existing_user and existing_user.userID != user_id:
            return jsonify({"msg": "Email already in use"}), 400
        user.email = request_body["email"]
    if "password" in request_body:
        user.password = request_body["password"]

    db.session.commit()

    return jsonify({"msg": "User updated", "user": user.serialize()}), 200



#GET /groups --> funciona
@api.route('/groups', methods=['GET'])
def get_all_groups():
    groups = Group.query.all() 
    groups_list = [group.serialize() for group in groups]  
    return jsonify(groups_list)


#GET /group --> funciona
@api.route('/groups/<int:group_id>', methods=['GET'])
def get_group(group_id):
    group = Group.query.get(group_id)
    if group is None:
        return jsonify({"error": "Group not found"}), 404 
    return jsonify(group.serialize())



#POST /groups --> funciona
@api.route('/groups', methods=['POST'])
def create_group():
    request_data = request.get_json()
    if "Group name" not in request_data:
        return jsonify({"msg": "Group name is required"}), 400

    new_group = Group(
        group_name=request_data["Group name"],
        created_at=datetime.utcnow()
    )
    
    db.session.add(new_group)
    db.session.commit()

    if "members" in request_data:
        for user_id in request_data["members"]:
            group_to_user = Group_to_user(userID=user_id, groupId=new_group.groupID, created_at=datetime.utcnow())
            db.session.add(group_to_user)
        
        db.session.commit()

    return jsonify(new_group.serialize()), 201


#DELETE /group --> funciona
@api.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404
    
    group_to_user_entries = Group_to_user.query.filter_by(groupId=group_id).all()
    for entry in group_to_user_entries:
        db.session.delete(entry)
    
    db.session.delete(group)
    db.session.commit()

    return jsonify({"msg": "Group deleted"}), 200


#PUT /group_id --> funciona
@api.route('/groups/<int:group_id>', methods=['PUT'])
def update_group(group_id):
    request_data = request.get_json()
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    if "group_name" in request_data:
        group.group_name = request_data["group_name"]

    if "members" in request_data:
        # Borrar los miembros actuales del grupo
        Group_to_user.query.filter_by(groupId=group_id).delete()

        for user_id in request_data["members"]:
            group_to_user = Group_to_user(userID=user_id, groupId=group_id, created_at=datetime.utcnow())
            db.session.add(group_to_user)

    db.session.commit()

    return jsonify(group.serialize()), 200



#POST /groups_users funciona
@api.route('/groups_users', methods=['POST'])
def add_user_to_group():
    request_data = request.get_json()


    if "userID" not in request_data or "groupID" not in request_data:
        return jsonify({"msg": "Both userID and groupID are required"}), 400
    
    user_id = request_data["userID"]
    group_id = request_data["groupID"]

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    existing_entry = Group_to_user.query.filter_by(userID=user_id, groupId=group_id).first()
    if existing_entry:
        return jsonify({"msg": "User is already in the group"}), 400

    new_group_user = Group_to_user(userID=user_id, groupId=group_id, created_at=datetime.utcnow())
    db.session.add(new_group_user)
    db.session.commit()

    return jsonify({"msg": "User added to group successfully"}), 201



#DELETE /groups_users funciona
@api.route('/groups_users', methods=['DELETE'])
def remove_user_from_group():
    request_data = request.get_json()

    if "userID" not in request_data or "groupID" not in request_data:
        return jsonify({"msg": "Both userID and groupID are required"}), 400

    user_id = request_data["userID"]
    group_id = request_data["groupID"]

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    group_to_user_entry = Group_to_user.query.filter_by(userID=user_id, groupId=group_id).first()
    if not group_to_user_entry:
        return jsonify({"msg": "User is not part of the group"}), 400

    db.session.delete(group_to_user_entry)
    db.session.commit()

    return jsonify({"msg": "User removed from group successfully"}), 200




