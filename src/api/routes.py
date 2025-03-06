"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
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

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


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


@api.route("/payments", methods=["GET"])
def get_payments():
    payments = Payments.query.all()
    payments_info = [payment.serialize() for payment in payments]
    return jsonify(payments_info), 200


