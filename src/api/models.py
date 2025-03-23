from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, unique=True, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=True)  # Add this field
    groups = db.relationship("Group_to_user", back_populates="user")
    expenses = db.relationship("Expenses", backref="user")
    payer = db.relationship('Payments', backref='payer', lazy='dynamic', primaryjoin="User.user_id == Payments.payer_id")
    receiver = db.relationship('Payments', backref='receiver', lazy='dynamic', primaryjoin="User.user_id == Payments.receiver_id")
    debts = db.relationship("Debts", backref="user")

    def __repr__(self):
        return f'<User {self.name}>'

    def get_initial(self):
        """Return the first letter of the user's name in uppercase."""
        return self.name[0].upper() if self.name else "?"

    def serialize(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "birthday": self.birthday.strftime('%Y-%m-%d') if self.birthday else None,  # Format for JSON
            "initial": self.get_initial(),
            "groups": [group.serialize() for group in self.groups] if self.groups else [],
            "expenses": [expense.serialize() for expense in self.expenses] if self.expenses else [],
            "debts": [debt.serialize() for debt in self.debts] if self.debts else [],
            "payer": [payment.serialize() for payment in self.payer] if self.payer else [],
            "receiver": [payment.serialize() for payment in self.receiver] if self.receiver else []
        }
    

class Group(db.Model):
    __tablename__ = "group"
    group_id = db.Column(db.Integer, unique=True, primary_key=True)
    group_name = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime) 
    members = db.relationship("Group_to_user")
    total_amount = db.Column(db.Integer, nullable=False, default=0)
    expenses = db.Column(db.Integer, db.ForeignKey("expenses.expense_id"))

    def __repr__(self):
        return f'<Group {self.group_name}>'

    def serialize(self):
        return {
            "group_id": self.group_id,
            "group_name": self.group_name,
            "members": [member.serialize() for member in self.members] if self.members else [],
            "created_at": self.created_at,
            "total_amount": self.total_amount,
            "expenses": self.expenses if self.expenses else None,
        }

class User_Contacts(db.Model):
    __tablename__ = "user_contacts"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now()) 
    is_active = db.Column(db.Boolean, default=True)

    user = db.relationship("User", foreign_keys=[user_id], backref="contacts_as_user")
    contact = db.relationship("User", foreign_keys=[contact_id], backref="contacts_as_contact")

    def __repr__(self):
        return f'<User_Contacts {self.user_id} -> {self.contact_id}>'

    def serialize(self):
        contact = User.query.get(self.contact_id)

        contact_initial = contact.name[0] if contact and contact.name else None


        return {
            "id": self.id,
            "contact_name": contact.name if contact else None, 
            "contact_email": contact.email, 
            "contact_initial": contact_initial,
            "user_id": self.user_id,
            "contact_id": self.contact_id,
            "created_at": self.created_at,
            "is_active": self.is_active,
        }



class Group_to_user(db.Model):
    __tablename__ = "group_to_user"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"))
    created_at = db.Column(db.DateTime)  # Can be renamed later to "joined_at"

    user = db.relationship("User", back_populates="groups")

    def __repr__(self):
        return f'<Group_to_user {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "group_id": self.group_id,
            "created_at": self.created_at,
            "initial": self.user.get_initial() if self.user else "?", 
        }
    

class Group_payments(db.Model):
    __tablename__ = "group_payments"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)

    def serialize(self):
        payer = User.query.get(self.payer_id)
        receiver = User.query.get(self.receiver_id)
        group = Group.query.get(self.group_id)

        return {
            "id": self.id,
            "payer_name": payer.name if payer else "Unknown",
            "receiver_name": receiver.name if receiver else (group.group_name if group else "Unknown"),
            "group_name": group.group_name if group else None,
            "amount": self.amount,
            "payed_at": self.payed_at
        }
    

class Group_debts(db.Model):
    __tablename__ = "group_debts"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    debtor_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)  
    creditor_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)
    is_paid = db.Column(db.Boolean, default=False)  # Para indicar si se ha pagado o no

    def serialize(self):
        debtor = User.query.get(self.debtor_id)
        creditor = User.query.get(self.creditor_id)
        group = Group.query.get(self.group_id)

        return {
            "id": self.id,
            "debtor_name": debtor.name if debtor else "Unknown",
            "creditor_name": creditor.name if creditor else (group.group_name if group else "Unknown"), 
            "group_name": group.group_name if group else None,
            "amount": self.amount,
            "is_paid": self.is_paid, 
            "payed_at": self.payed_at
        }



class Payments(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    debt_id = db.Column(db.Integer, db.ForeignKey("debts.debt_id"))
    payer_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)

    def serialize(self):
        payer = User.query.get(self.payer_id)
        receiver = User.query.get(self.receiver_id)

        return {
            "id": self.id,
            "debt_id": self.debt_id,
            "payer_name": payer.name if payer else "Unknown",
            "receiver_name": receiver.name if receiver else "Unknown",
            "amount": self.amount,
            "payed_at": self.payed_at
        }
    
class Expenses(db.Model):
    __tablename__ = "expenses"
    expense_id = db.Column(db.Integer,unique=True, primary_key=True)
    group_id = db.relationship("Group", backref="group")
    payer_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    shared_between = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime)
    debts= db.relationship("Debts", backref="expenses")
   

    def __repr__(self):
        return f'<Expenses {self.amount}>'

    def serialize(self):
        return {
            "expense_id": self.expense_id,
            "group_id": self.group_id,
            "payer_id": self.payer_id,
            "shared_between": self.shared_between,
            "amount": self.amount,
            "description": self.description,
            "created_at": self.created_at,
            
        }
    
class Debts(db.Model):
    __tablename__="debts"
    debt_id=db.Column(db.Integer, unique=True, primary_key=True)
    expenses_id=db.Column(db.Integer, db.ForeignKey("expenses.expense_id"))
    debtor_id=db.Column(db.Integer, db.ForeignKey("user.user_id"))
    amount_to_pay=db.Column(db.Integer, nullable=False)
    is_paid=db.Column(db.Boolean, nullable=False, default=False)
    payed_at=db.Column(db.DateTime)
    payments = db.relationship("Payments", backref="debts")
    
    
    def __repr__(self):
        return f'<Debts {self.debt_id}>'

    def serialize(self):
        return {
            "debt_id": self.debt_id,
            "expenses_id": self.expenses_id,
            "debtor_id": self.debtor_id,
            "amount_to_pay": self.amount_to_pay,
            "is_paid": self.is_paid,
            "payed_at": self.payed_at,

        }
    
class Messages(db.Model):
    __tablename__ = "messages"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    sent_to_user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    from_user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    message = db.Column(db.String(200))
    sent_at = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Messages {self.id}>'

    def serialize(self):
        
        sender = User.query.get(self.from_user_id)
        recipient = User.query.get(self.sent_to_user_id)

        sender_initial = sender.name[0] if sender and sender.name else None
        recipient_initial = recipient.name[0] if recipient and recipient.name else None

        return {
            "id": self.id,
            "sent_to_user_id": self.sent_to_user_id,
            "sent_to_user_name": recipient.name if recipient else None,  
            "sent_to_user_initial": recipient_initial,
            "from_user_id": self.from_user_id,
            "from_user_name": sender.name if sender else None,  
            "from_user_initial": sender_initial,
            "message": self.message,
            "sent_at": self.sent_at
        }
    
class Objectives(db.Model):
    __tablename__ = "objectives"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"))
    name = db.Column(db.String(20), nullable=False)
    target_amount = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime)
    is_completed = db.Column(db.Boolean, nullable=False, default=False)
    
    group = db.relationship("Group", backref="objectives")
    objective_contributions = db.relationship("ObjectivesContributions", back_populates="objective", lazy="dynamic")

    def serialize(self):
        total_contributed = db.session.query(
            db.func.coalesce(db.func.sum(ObjectivesContributions.amount_contributed), 0)
        ).filter_by(objective_id=self.id).scalar()
        
        remaining_amount = max(self.target_amount - total_contributed, 0)
    
        return {
            "id": self.id,
            "group_id": self.group_id,
            "name": self.name,
            "target_amount": self.target_amount,
            "total_contributed": total_contributed,
            "remaining_amount": remaining_amount,
            "created_at": self.created_at,
            "is_completed": self.is_completed,
            "participants": [
                {
                    "id": member.user.user_id,
                    "name": member.user.name if member.user else "Unknown",
                    "email": member.user.email if member.user else "Unknown",
                    "initial": member.user.name[0] if member.user and member.user.name else None
                }
                for member in self.group.members
            ] if self.group else [], 
            "contributions": [
                {
                    "id": contribution.id,
                    "user_id": contribution.user_id,
                    "amount_contributed": contribution.amount_contributed,
                    "user_name": contribution.user.name,
                    "contributed_at": contribution.contributed_at
                }
                for contribution in self.objective_contributions
            ]
        }
        

class ObjectivesContributions(db.Model):
    __tablename__ = "objective_contributions"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    objective_id = db.Column(db.Integer, db.ForeignKey("objectives.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    amount_contributed = db.Column(db.Integer, nullable=False)
    contributed_at = db.Column(db.DateTime)

    user = db.relationship("User", backref="user_contributions")
    objective = db.relationship("Objectives", back_populates="objective_contributions")

    def serialize(self):
        user = User.query.get(self.user_id)
        objective = Objectives.query.get(self.objective_id)

        return {
            "id": self.id,
            "user_name": user.name if user else "Unknown",
            "objective_name": objective.name if objective else "Unknown",
            "amount_contributed": self.amount_contributed,
            "contributed_at": self.contributed_at
        }
    
class Feedback(db.Model):
    __tablename__ ="feedback"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(80), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "message": self.message,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }