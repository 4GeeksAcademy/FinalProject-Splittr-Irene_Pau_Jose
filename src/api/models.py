from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    userID = db.Column(db.Integer,unique=True, primary_key=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    groups = db.relationship("Group_to_user", backref="user")
    expenses = db.relationship("Expenses", backref="user")
    payer = db.relationship('Payments', backref='payer', lazy='dynamic', primaryjoin="User.userID == Payments.payerID")
    receiver = db.relationship('Payments', backref='receiver', lazy='dynamic', primaryjoin="User.userID == Payments.receiverID")
    debts = db.relationship("Debts", backref="user")

    def __repr__(self):
        return f'<User {self.name}>'

    def serialize(self):
        return {
            "Name": self.name,
            "Email": self.email,
            "Groups": self.groups,
            "Expenses": self.expenses,
            "Debts": self.debts,
            "Payments": self.payments
            
        }
    

class Group(db.Model):
    __tablename__ = "group"
    groupID = db.Column(db.Integer,unique=True, primary_key=True)
    group_name = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime) 
    members = db.relationship("Group_to_user")
    total_Amount = db.Column(db.Integer, nullable=False)
    expenses = db.Column(db.Integer, db.ForeignKey("expenses.expenseID"))
    
    def __repr__(self):
        return f'<Group {self.group_name}>'

    def serialize(self):
        return {
            "Id": self.groupID,
            "Name": self.group_name,
            "Members": self.members,
            "Total Amount": self.total_Amount,
            "Expenses": self.expenses
            
        }
  

class Group_to_user(db.Model):
    __tablename__ = "group_to_user"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    userID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    groupId = db.Column(db.Integer, db.ForeignKey("group.groupID"))
    created_at = db.Column(db.DateTime)


    
    def __repr__(self):
        return f'<Group_to_user {self.id}>'

    def serialize(self):
        return {
            "User": self.userID,
            "Group": self.groupId,
            "Joined at": self.joined_at
        }

class Group_payments(db.Model):
    __tablename__ = "group_payments"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    receiverID = db.Column(db.Integer, db.ForeignKey("user.userID"), nullable=False)
    payerID = db.Column(db.Integer, db.ForeignKey("user.userID"), nullable=False)
    groupID = db.Column(db.Integer, db.ForeignKey("group.groupID"), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)
    



    
    def __repr__(self):
        return f'<Group_payments {self.id}>'

    def serialize(self):
        return {
            "User": self.receiverID,
            "Group": self.groupId,
            
        }


class Payments(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer,unique=True, primary_key=True)
    debtID = db.Column(db.Integer, db.ForeignKey("debts.debtID"))
    payerID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    receiverID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    amount = db.Column(db.Integer, nullable=False)
    payed_at = db.Column(db.DateTime)
    

    def __repr__(self):
        return f'<Payments {self.debtID}>'

    def serialize(self):
        return {
            "Amount": self.amount,
            "User": self.payerID,
        }
    
class Expenses(db.Model):
    __tablename__ = "expenses"
    expenseID = db.Column(db.Integer,unique=True, primary_key=True)
    groupID = db.relationship("Group", backref="group")
    payerId = db.Column(db.Integer, db.ForeignKey("user.userID"))
    shared_between = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime)
    debts= db.relationship("Debts", backref="expenses")
   

    def __repr__(self):
        return f'<Expenses {self.amount}>'

    def serialize(self):
        return {
            "Group": self.groupID,
            "Amount": self.amount,
            "Description": self.description,
            
        }
    
class Debts(db.Model):
    __tablename__="debts"
    debtID=db.Column(db.Integer, unique=True, primary_key=True)
    expensesID=db.Column(db.Integer, db.ForeignKey("expenses.expenseID"))
    debtorID=db.Column(db.Integer, db.ForeignKey("user.userID"))
    amount_to_pay=db.Column(db.Integer, nullable=False)
    is_paid=db.Column(db.Boolean, nullable=False, default=False)
    payed_at=db.Column(db.DateTime)
    payments = db.relationship("Payments", backref="debts")
    
    


    def __repr__(self):
        return f'<Debts {self.debtID}>'

    def serialize(self):
        return {
            "Id": self.debtID,
            "Amount": self.amount_to_pay,
            
        }
    

class Messages (db.Model):
    __tablename__="messages"
    id=db.Column(db.Integer, unique=True, primary_key=True)
    sent_to_userid=db.relationship("User", backref="messages")
    from_userid=db.Column(db.Integer, db.ForeignKey("user.userID"))
    message=db.Column(db.String(200))
    sent_at=db.Column(db.DateTime)


    def __repr__(self):
        return f'<Messages {self.id}>'

    def serialize(self):
        return {
            "From": self.from_userid,
            "To": self.sent_to_userid,
            "Message": self.message,
            
        }
    

class Objectives(db.Model):
    __tablename__="objectives"
    id=db.Column(db.Integer, unique=True, primary_key=True)
    groupID=db.Column(db.Integer, db.ForeignKey("group.groupID"))
    name=db.Column(db.String(20), nullable=False)
    target_amount=db.Column(db.Integer, nullable=False)
    created_at=db.Column(db.DateTime)
    is_completed=db.Column(db.Boolean, nullable=False, default=False)
    


    def __repr__(self):
        return f'<Objectives {self.name}>'

    def serialize(self):
        return {
            "Objective": self.name,
            "Amount": self.targetAmount,
            "Completed": self.is_completed
        }
    

class ObjectivesContributions(db.Model):

    __tablename__="objetive_contributions"
    id = db.Column(db.Integer, unique=True, primary_key=True)
    objectiveID = db.Column(db.Integer, db.ForeignKey("objectives.id"))
    userID = db.Column(db.Integer, db.ForeignKey("user.userID"))
    amount_contributed=db.Column(db.Integer, nullable=False)
    contributed_at=db.Column(db.DateTime)

    
    def __repr__(self):
        return f'<ObjectivesContributions {self.ObjectiveID}>'

    def serialize(self):
        return {
            "ID": self.id,
            "Amount per user": self.userID,
            "Total amount contributed": self.amount_contributed
            
        }
    
