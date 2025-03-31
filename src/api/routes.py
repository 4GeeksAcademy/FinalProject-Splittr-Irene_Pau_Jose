"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Expenses, Debts, Objectives, Group, ObjectivesContributions, Messages, Payments, Group_payments, Group_to_user, User_Contacts, Group_debts, Feedback, Objective_to_user, Conversation, User_to_Conversation

from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from datetime import datetime
from api.data import users, groups, group_to_user, group_payments, payments, expenses, debts, objectives, objectives_contributions, user_contacts, group_debts, objective_to_user, messages, conversations, user_to_conversation;


from flask_mail import Mail, Message
from flask import current_app


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

    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided"}), 400

    # Check if email is being changed and validate
    if "email" in data:
        if not data["email"]:
            return jsonify({"msg": "Email cannot be empty"}), 422
        if data["email"] != user.email:
            existing_user = User.query.filter_by(email=data["email"]).first()
            if existing_user:
                return jsonify({"msg": "Email already in use"}), 422
            user.email = data["email"]

    # Update name if provided
    if "name" in data:
        if data["name"]:  # Only update if not empty
            user.name = data["name"]
        else:
            return jsonify({"msg": "Name cannot be empty"}), 422

    # Update password if provided
    if "password" in data:
        if data["password"]:  # Only update if not empty
            user.password = data["password"]
        else:
            return jsonify({"msg": "Password cannot be empty"}), 422

    # Update birthday if provided
    if "birthday" in data:
        if data["birthday"]:  # Only update if not empty
            try:
                user.birthday = datetime.strptime(data["birthday"], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"msg": "Invalid date format (use YYYY-MM-DD)"}), 422
        else:
            user.birthday = None  # Allow clearing birthday by sending empty string/null

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
        return jsonify({"msg": "No debts found for this group"}), 203

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

@api.route('/user_contacts/invitation', methods=['POST'])
@jwt_required()
def send_invitation():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    request_data = request.get_json()
    contact_email = request_data.get("contact_email")

    if not contact_email:
        return jsonify({"msg": "contact_email is required"}), 400
    
    if contact_email.lower() == user.email.lower():
        return jsonify({"msg": "You cannot invite yourself"}), 400
    
    # Check if the email belongs to a registered user
    contact = User.query.filter_by(email=contact_email).first()
    if contact:
        return jsonify({"msg": "This user is already registered, add them as a contact instead"}), 400
    
    # Generate a random temporary password
    import secrets
    import string
    alphabet = string.ascii_letters + string.digits
    temp_password = ''.join(secrets.choice(alphabet) for _ in range(12))
    
    # Extract a username from the email to keep name length within 20 chars
    username = contact_email.split('@')[0]
    if len(username) > 12:  # Ensure "Invited-" + username stays under 20 chars
        username = username[:12]
    
    # Check if there's already an invitation
    existing_invitation = (
        db.session.query(User_Contacts)
        .join(User, User_Contacts.contact_id == User.user_id)
        .filter(
            User_Contacts.user_id == current_user_id,
            User.email == contact_email,
            User_Contacts.is_active == True
        )
        .first()
    )
    
    if existing_invitation:
        return jsonify({"msg": "An invitation has already been sent to this email"}), 400

    try:
        # Create temporary placeholder user with the generated password
        temp_user = User(
            name=f"Invited - {username}",
            email=contact_email,
            password=temp_password,  # Store the generated password
            birthday=None
        )
        db.session.add(temp_user)
        db.session.flush()

        # Send invitation email
        invitation_link = f"https://your-app.com/register?email={contact_email}"
        login_link = f"https://your-app.com/login"
        
        try:
            subject = f"{user.name} invited you to join SPLTTR!"
            msg = Message(
                subject=subject,
                sender=current_app.config.get("MAIL_USERNAME"),
                recipients=[contact_email],
                body=f"""Hi there,

{user.name} ({user.email}) has invited you to join SPLTTR, the expense sharing platform!

Here are your temporary account details:
Email: {contact_email}
Temporary Password: {temp_password}

You can:
1. Click here to login directly: {login_link}
   (Use the temporary credentials above)
   
2. Or register a new account here: {invitation_link}

Note: For security reasons, please change your password after first login.

We're excited to have you on board!
The SPLTTR Team""",
                html=f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ color: #2c3e50; border-bottom: 2px solid #f1f1f1; padding-bottom: 10px; }}
        .content {{ margin: 20px 0; }}
        .details {{ background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }}
        .button {{ display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }}
        .footer {{ margin-top: 20px; font-size: 0.9em; color: #7f8c8d; border-top: 1px solid #f1f1f1; padding-top: 10px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>You've been invited to SPLTTR!</h1>
    </div>
    
    <div class="content">
        <p>Hello,</p>
        <p><strong>{user.name}</strong> ({user.email}) has invited you to join SPLTTR, the expense sharing platform.</p>
        
        <div class="details">
            <h3>Your temporary account details:</h3>
            <p><strong>Email:</strong> {contact_email}</p>
            <p><strong>Temporary Password:</strong> {temp_password}</p>
            
            <p>You have two options:</p>
            <ol>
                <li>Use the temporary credentials to <a href="{login_link}" class="button">Login Now</a></li>
                <li>Or <a href="{invitation_link}">register a new account</a> with your own password</li>
            </ol>
            
            <p><em>Security note: Please change your password after first login.</em></p>
        </div>
    </div>
    
    <div class="footer">
        <p>We're excited to have you on board!</p>
        <p>The SPLTTR Team</p>
    </div>
</body>
</html>
"""
            )
            mail = current_app.extensions.get('mail')
            if mail:
                mail.send(msg)
                email_sent = True
            else:
                email_sent = False
        except Exception as mail_error:
            print(f"Email sending failed: {str(mail_error)}")
            email_sent = False

        # Store invitation with the temporary user ID as contact_id
        new_invitation = User_Contacts(
            user_id=current_user_id,
            contact_id=temp_user.user_id,
            created_at=datetime.utcnow(),
            is_active=True
        )
        db.session.add(new_invitation)
        db.session.commit()

        return jsonify({
            "msg": "Invitation sent successfully",
            "contact": {
                "id": new_invitation.id,
                "contact_email": contact_email,
                "user_id": current_user_id,
                "contact_id": temp_user.user_id,
                "created_at": new_invitation.created_at,
                "is_active": new_invitation.is_active,
                "status": "invited"
            },
            "email_sent": email_sent,
            "temp_password": temp_password  
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error sending invitation", "error": str(e)}), 500
    

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

    if not request_data or "user_id" not in request_data or "group_id" not in request_data:
        return jsonify({"msg": "Both user_id and group_id are required"}), 400

    user_id = request_data["user_id"]
    group_id = request_data["group_id"]

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"msg": "Group not found"}), 404

    user_to_add = User.query.get(user_id)
    if not user_to_add:
        return jsonify({"msg": "User not found"}), 404

    try:
        existing_entry = Group_to_user.query.filter_by(user_id=user_id, group_id=group_id).first()
        if existing_entry:
            return jsonify({"msg": "User is already in the group"}), 400

        new_group_user = Group_to_user(user_id=user_id, group_id=group_id, created_at=datetime.utcnow())
        db.session.add(new_group_user)
        db.session.commit()

        return jsonify({
            "msg": "User added to group successfully",
            "group": group.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Internal server error"}), 500



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

    # Create payment with current timestamp
    new_payment = Payments(
        amount=data["amount"], 
        payer_id=data["payer_id"], 
        receiver_id=data["receiver_id"],
        payed_at=datetime.utcnow(),  # Set the payed_at timestamp
        debt_id=data.get("debt_id")  # Optional: include debt_id if provided
    )

    db.session.add(new_payment)
    db.session.commit()

    return jsonify({"msg": "Payment was successfully done", "payment": new_payment.serialize()}), 201

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



@api.route('/message/user', methods=['GET'])
@jwt_required()
def get_messages_by_id(sent_to_user_id):
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    # Find or create a conversation between these two users
    conversation = Conversation.query.filter(
        Conversation.participants.any(user_id=current_user_id),
        Conversation.participants.any(user_id=sent_to_user_id)
    ).first()
    
    if not conversation:
        return jsonify({"error": "No conversation found"}), 404
    
    messages = Messages.query.filter_by(conversation_id=conversation.id).all()
    
    user_messages = [message.serialize() for message in messages]

    return jsonify(user_messages), 200

@api.route('/message/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_messages_by_user_id(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401


    user_conversations = User_to_Conversation.query.filter_by(user_id=user_id).all()

    conversations = []
    for user_conversation in user_conversations:
        conversation = Conversation.query.get(user_conversation.conversation_id)
        if conversation:
            conversations.append(conversation.serialize())

    return jsonify(conversations), 200


@api.route('/conversations/mapped/<int:user_id>', methods=['GET'])
@jwt_required()
def get_mapped_conversations(user_id):
    current_user_id = get_jwt_identity()

    # Find all conversations the user is part of
    user_conversations = User_to_Conversation.query.filter_by(user_id=user_id).all()

    # Dictionary to store mapped conversations
    mapped_conversations = {}

    for user_conversation in user_conversations:
        conversation = user_conversation.conversation
        
        if conversation:
            # Get all messages in this conversation sorted by timestamp
            messages = Messages.query.filter_by(conversation_id=conversation.id)\
                .order_by(Messages.sent_at.desc()).all()
            
            # Find other participants in the conversation
            other_participants = User_to_Conversation.query.filter(
                User_to_Conversation.conversation_id == conversation.id,
                User_to_Conversation.user_id != user_id
            ).all()

            for participant in other_participants:
                other_user = participant.user
                
                if other_user:
                    # Create or update conversation entry for this user
                    if other_user.user_id not in mapped_conversations:
                        mapped_conversations[other_user.user_id] = {
                            'user_id': other_user.user_id,
                            'username': other_user.name,
                            'conversations': []
                        }

                    # Prepare conversation details
                    conversation_details = {
                        'conversation_id': conversation.id,
                        'last_message': messages[0].message if messages else None,
                        'last_message_timestamp': messages[0].sent_at.isoformat() if messages else None,
                        'last_message_sender_id': messages[0].from_user_id if messages else None,
                        'messages': [msg.serialize() for msg in messages]
                    }
                    
                    mapped_conversations[other_user.user_id]['conversations'].append(conversation_details)

    # Convert dictionary to list and return
    return jsonify(list(mapped_conversations.values())), 200


@api.route('/message/conversation/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  
    
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    # Find or create a conversation between these two users
    conversation = Conversation.query.filter(
        Conversation.participants.any(user_id=current_user_id),
        Conversation.participants.any(user_id=other_user_id)
    ).first()
    
    if not conversation:
        return jsonify({"error": "No conversation found between these users"}), 404

    messages = Messages.query.filter_by(conversation_id=conversation.id).order_by(Messages.sent_at).all()

    return jsonify([message.serialize() for message in messages]), 200


@api.route("/message/send", methods=["POST"])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity() 
    user = User.query.get(current_user_id)  
    if user is None:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    # Validate required fields
    required_fields = ["sent_to_user_id", "message"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate message content
    if not isinstance(data["message"], str) or len(data["message"].strip()) == 0:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Check recipient exists
    to_user = User.query.get(data["sent_to_user_id"])
    if not to_user:
        return jsonify({"error": "Recipient user not found"}), 404

    # Prevent sending to self
    if current_user_id == data["sent_to_user_id"]:
        return jsonify({"error": "Cannot send message to yourself"}), 400

    # Find existing conversation between these users
    conversation = find_or_create_conversation(current_user_id, data["sent_to_user_id"])

    # Create and save the message
    new_message = Messages(
        conversation_id=conversation.id,
        sent_to_user_id=data["sent_to_user_id"], 
        message=data["message"].strip(), 
        from_user_id=current_user_id
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify({
        "msg": "Message sent successfully", 
        "message": new_message.serialize(),
        "conversation_id": conversation.id
    }), 201


def find_or_create_conversation(user1_id, user2_id):
    """Helper function to find or create a conversation between two users"""
    # Check for existing conversation
    existing = db.session.query(Conversation).join(
        User_to_Conversation,
        User_to_Conversation.conversation_id == Conversation.id
    ).filter(
        User_to_Conversation.user_id.in_([user1_id, user2_id])
    ).group_by(
        Conversation.id
    ).having(
        db.func.count(User_to_Conversation.user_id.distinct()) == 2
    ).first()

    if existing:
        return existing

    # Create new conversation if none exists
    new_conversation = Conversation()
    db.session.add(new_conversation)
    db.session.flush()  # To get the ID
    
    # Add participants
    participant1 = User_to_Conversation(user_id=user1_id, conversation_id=new_conversation.id)
    participant2 = User_to_Conversation(user_id=user2_id, conversation_id=new_conversation.id)
    
    db.session.add(participant1)
    db.session.add(participant2)
    db.session.commit()

    return new_conversation



@api.route("/objective", methods=["GET"])
@jwt_required()
def get_objectives():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    objectives = Objectives.query.join(Objective_to_user).filter(Objective_to_user.user_id == current_user_id).all()
    return jsonify([objective.serialize() for objective in objectives]), 200


@api.route("/objective/user/<int:user_id>", methods=["GET"])
@jwt_required()
def get_objectives_by_user_id(user_id):
    current_user_id = get_jwt_identity()
    
    if not User.query.get(current_user_id):
        return jsonify({"msg": "You need to be logged in"}), 401

    objectives = Objectives.query.join(Objective_to_user).filter(Objective_to_user.user_id == user_id).all()

    if not objectives:
        return jsonify({"msg": "User is not participating in any objectives"}), 404

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

    user_membership = Objective_to_user.query.filter_by(user_id=current_user_id, objective_id=objective_id).first()
    
    if not user_membership:
        return jsonify({"error": "You don't have permission to view this objective"}), 403
    
    return jsonify(objective.serialize()), 200


@api.route("/objective/create", methods=["POST"])
@jwt_required()
def create_objective():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    data = request.get_json()

    if "name" not in data or "target_amount" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    new_objective = Objectives(name=data["name"], target_amount=data["target_amount"])
    db.session.add(new_objective)
    db.session.commit()

    # Automatically add creator to Objective_to_user
    db.session.add(Objective_to_user(user_id=current_user_id, objective_id=new_objective.id))
    db.session.commit()

    return jsonify({"msg": "Objective was successfully created"}), 201


@api.route("/objective/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_objective(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)  
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401
    
    objective = Objectives.query.get(id)
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    # Ensure user is a participant before deleting
    membership = Objective_to_user.query.filter_by(user_id=current_user_id, objective_id=id).first()
    if not membership:
        return jsonify({"error": "You cannot delete this objective"}), 403
    
    db.session.delete(objective)
    db.session.commit()

    return jsonify({"msg": "Objective successfully deleted"}), 200


@api.route("/objective/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_objective(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401

    objective = Objectives.query.get(id)
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    membership = Objective_to_user.query.filter_by(user_id=current_user_id, objective_id=id).first()
    if not membership:
        return jsonify({"error": "You cannot update this objective"}), 403

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
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401

    data = request.get_json()

    if "objective" not in data or "amount" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    objective = Objectives.query.get(data["objective"])
    if not objective:
        return jsonify({"error": "Objective not found"}), 404

    # Ensure the user is part of the objective
    membership = Objective_to_user.query.filter_by(
        user_id=current_user_id, 
        objective_id=data["objective"]
    ).first()
    if not membership:
        return jsonify({"error": "You cannot contribute to this objective"}), 403

    total_contributed = db.session.query(
        db.func.sum(ObjectivesContributions.amount_contributed)
    ).filter_by(objective_id=data["objective"]).scalar() or 0

    if total_contributed + data["amount"] > objective.target_amount:
        return jsonify({"error": "Contribution exceeds target amount"}), 400
    
    if objective.is_completed:
        return jsonify({"error": "Objective is already completed"}), 400

    # Create the contribution with explicit timestamp like in Payments
    contribution = ObjectivesContributions(
        amount_contributed=data["amount"],
        user_id=current_user_id,
        objective_id=data["objective"],

    )

    db.session.add(contribution)
    db.session.commit()

    return jsonify({
        "msg": "Contribution was successfully added",
        "contribution": contribution.serialize()  # Will now include properly formatted datetime
    }), 201


@api.route("/objective/contribution/<int:objective_id>", methods=["GET"])
@jwt_required()
def get_objective_contributions(objective_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "You need to be logged in"}), 401

    contributions = ObjectivesContributions.query.filter_by(objective_id=objective_id).all()

    if not contributions:
        return jsonify({"error": "No contributions found for this objective"}), 404

    return jsonify([contribution.serialize() for contribution in contributions]), 200



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

    user_contributions = ObjectivesContributions.query.filter_by(user_id=current_user_id).all()

    user_objectives = Objectives.query.join(Objective_to_user).filter(Objective_to_user.user_id == current_user_id).all()

    return jsonify({
        "sent_payments": [payment.serialize() for payment in sent_payments],
        "received_payments": [payment.serialize() for payment in received_payments],
        "group_payments": [gp.serialize() for gp in group_payments],
        "user_contributions": [contribution.serialize() for contribution in user_contributions],
        "user_objectives": [objective.serialize() for objective in user_objectives]
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

# @api.route("/messagespopulate", methods=["GET"])
# def messages_populate():
#     for message in messages:
#         new_message = Messages( from_user_id=message["from_user_id"],  message=message["message"], sent_at=message["sent_at"], sent_to_user_id=message["sent_to_user_id"])
#         #
#         db.session.add(new_message)
#     db.session.commit()
#     return jsonify("Messages have been created")

@api.route("/objectivespopulate", methods=["GET"])
def objectives_populate():
    # Sample data for objectives
    objectives_data = [
        {"id": 1, "name": "Trip to Japan", "target_amount": 5000, "created_at": "2024-02-15T14:00:00", "is_completed": False},
        {"id": 2, "name": "New Apartment", "target_amount": 10000, "created_at": "2024-02-15T14:00:00", "is_completed": False},
        {"id": 3, "name": "Fitness Challenge", "target_amount": 800, "created_at": "2024-02-15T14:00:00", "is_completed": True},
        {"id": 4, "name": "Gaming Setup", "target_amount": 2000, "created_at": "2024-02-15T14:00:00", "is_completed": False},
        {"id": 5, "name": "Startup Fund", "target_amount": 15000, "created_at": "2024-02-15T14:00:00", "is_completed": False}
    ]

    # Sample data for objective_to_user
    objective_to_user_data = [
        {"objective_id": 1, "user_id": 1, "created_at": "2024-01-01T12:10:00"},
        {"objective_id": 1, "user_id": 2, "created_at": "2024-01-02T13:15:00"},
        {"objective_id": 2, "user_id": 3, "created_at": "2024-02-11T14:30:00"},
        {"objective_id": 3, "user_id": 4, "created_at": "2024-03-16T08:45:00"},
        {"objective_id": 4, "user_id": 5, "created_at": "2024-04-20T14:45:00"},
        {"objective_id": 5, "user_id": 1, "created_at": "2024-05-05T17:20:00"},
        {"objective_id": 5, "user_id": 5, "created_at": "2024-05-06T10:00:00"}
    ]

    try:
        # Populate the objectives table
        for objective in objectives_data:
            new_objective = Objectives(
                name=objective["name"],
                target_amount=objective["target_amount"],
                created_at=datetime.fromisoformat(objective["created_at"]),
                is_completed=objective["is_completed"]
            )
            db.session.add(new_objective)

        # Populate the objective_to_user table
        for entry in objective_to_user_data:
            new_objective_to_user = Objective_to_user(
                objective_id=entry["objective_id"],
                user_id=entry["user_id"],
                created_at=datetime.fromisoformat(entry["created_at"])
            )
            db.session.add(new_objective_to_user)

        # Commit all changes to the database
        db.session.commit()

        return jsonify({"message": "Objectives and objective_to_user data have been successfully populated"}), 200

    except Exception as e:
        # Rollback in case of error
        db.session.rollback()
        return jsonify({"error": f"An error occurred while populating the database: {str(e)}"}), 500


@api.route("/objectivetouserpopulate", methods=["GET"])
def objective_to_user_populate():
    for entry in objective_to_user:
        new_objective_to_user = Objective_to_user(
             objective_id=entry["objective_id"],
             user_id=entry["user_id"],
             created_at=datetime.fromisoformat(entry["created_at"])  # Convert string to datetime
            )
         
        db.session.add(new_objective_to_user)
    db.session.commit()
    return jsonify({"message": "Objective_to_user data has been successfully populated"}), 200


@api.route("/objectivescontributionspopulate", methods=["GET"])
def objectives_contributions_populate():
    for objective in objectives_contributions:
        new_objectives_contribution = ObjectivesContributions(objective_id=objective["objective_id"], user_id=objective["user_id"], amount_contributed=objective["amount_contributed"], contributed_at=objective["contributed_at"])
        #
        db.session.add(new_objectives_contribution)
    db.session.commit()
    return jsonify("Objectives Contributions have been created")


@api.route("/conversationspopulate", methods=["GET"])
def conversations_populate():
    for conversation in conversations:
        new_conversation = Conversation(
            id=conversation["id"],
            created_at=datetime.fromisoformat(conversation["created_at"])
        )
        db.session.add(new_conversation)
    db.session.commit()
    return jsonify({"message": "Conversations data has been successfully populated"}), 200


@api.route("/usertoconversationpopulate", methods=["GET"])
def user_to_conversation_populate():
    for participant in user_to_conversation:
        new_participant = User_to_Conversation(
            id=participant["id"],
            user_id=participant["user_id"],
            conversation_id=participant["conversation_id"],
            joined_at=datetime.fromisoformat(participant["joined_at"]),
            is_active=participant["is_active"]
        )
        db.session.add(new_participant)
    db.session.commit()
    return jsonify({"message": "User_to_Conversation data has been successfully populated"}), 200


@api.route("/messagespopulate", methods=["GET"])
def messages_populate():
    for message in messages:
        new_message = Messages(
            id=message["id"],
            conversation_id=message["conversation_id"],
            from_user_id=message["from_user_id"],
            sent_to_user_id=message["sent_to_user_id"],
            message=message["message"],
            sent_at=datetime.fromisoformat(message["sent_at"])
        )
        db.session.add(new_message)
    db.session.commit()
    return jsonify({"message": "Messages data has been successfully populated"}), 200