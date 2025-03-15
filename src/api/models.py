from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer,unique=True, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    groups = db.relationship("Group_to_user", backref="user")
    expenses = db.relationship("Expenses", backref="user")
    payer = db.relationship('Payments', backref='payer', lazy='dynamic', primaryjoin="User.user_id == Payments.payer_id")
    receiver = db.relationship('Payments', backref='receiver', lazy='dynamic', primaryjoin="User.user_id == Payments.receiver_id")
    debts = db.relationship("Debts", backref="user")

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "groups": [group.serialize() for group in self.groups] if self.groups else [],
            "expenses": [expense.serialize() for expense in self.expenses] if self.expenses else [],
            "debts": [debt.serialize() for debt in self.debts] if self.debts else [],
            "payer": [payment.serialize() for payment in self.payer] if self.payer else [],
            "receiver": [payment.serialize() for payment in self.receiver] if self.receiver else []
        }

    

class Group(db.Model):
    __tablename__ = "group"
    group_id = db.Column(db.Integer,unique=True, primary_key=True)
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
            "members": [members.serialize() for members in self.members] if self.members else [],
            "created_at": self.created_at,
            "total_amount": self.total_amount,
            "expenses": self.expenses if self.expenses else None,
        }


class Group_to_user(db.Model):
    __tablename__ = "group_to_user"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"))
    created_at = db.Column(db.DateTime) #no lo quiero tocar de momento, pero cambiar por joined at, no sé si influye en ningún otro modelo
    def __repr__(self):
        return f'<Group_to_user {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "group_id": self.group_id,
            "created_at": self.created_at 
        }
    

class Group_payments(db.Model):
    __tablename__ = "group_payments"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("group.group_id"), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)
    


    def __repr__(self):
        return f'<Group_payments {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "receiver_id": self.receiver_id,
            "payer_id": self.payer_id,
            "group_id": self.group_id,
            "amount": self.amount,
            "payed_at": self.payed_at,
            
        }


class Payments(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    debt_id = db.Column(db.Integer, db.ForeignKey("debts.debt_id"))
    payer_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)
    

    def __repr__(self):
        return f'<Payments {self.debt_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "debt_id": self.debt_id,
            "payer_id": self.payer_id,
            "receiver_id": self.receiver_id,
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
        return f'<Debts {self.debtID}>'

    def serialize(self):
        return {
            "debt_id": self.debt_id,
            "expenses_id": self.expenses_id,
            "debtor_id": self.debtor_id,
            "amount_to_pay": self.amount_to_pay,
            "is_paid": self.is_paid,
            "payed_at": self.payed_at,

            
        }
    

class Messages (db.Model):
    __tablename__="messages"
    id=db.Column(db.Integer, unique=True, primary_key=True)
    sent_to_user_id=db.relationship("User", backref="messages")
    from_user_id=db.Column(db.Integer, db.ForeignKey("user.user_id"))
    message=db.Column(db.String(200))
    sent_at=db.Column(db.DateTime)


    def __repr__(self):
        return f'<Messages {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "sent_to_user_id": self.sent_to_user_id,
            "from_user_id": self.from_user_id,
            "message": self.message,
            "sent_at": self.sent_at
            
        }
    

class Objectives(db.Model):
    __tablename__="objectives"
    id=db.Column(db.Integer, unique=True, primary_key=True)
    group_id=db.Column(db.Integer, db.ForeignKey("group.group_id"))
    name=db.Column(db.String(20), nullable=False)
    target_amount=db.Column(db.Integer, nullable=False)
    created_at=db.Column(db.DateTime)
    is_completed=db.Column(db.Boolean, nullable=False, default=False)
    


    def __repr__(self):
        return f'<Objectives {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "group_id": self.group_id,
            "name": self.name,
            "target_amount": self.target_amount,
            "created_at": self.created_at,
            "is_completed": self.is_completed
        }
    

class ObjectivesContributions(db.Model):

    __tablename__="objetive_contributions"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    objective_id = db.Column(db.Integer, db.ForeignKey("objectives.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"))
    amount_contributed=db.Column(db.Integer, nullable=False)
    contributed_at=db.Column(db.DateTime)

    
    def __repr__(self):
        return f'<ObjectivesContributions {self.objective_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "objective_id": self.objective_id,
            "user_id": self.user_id,
            "amount_contributed": self.amount_contributed,
            "contributed_at": self.contributed_at
            
        }
    
