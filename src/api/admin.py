  
import os
from flask_admin import Admin
from .models import db, User, Group, Payments, Group_to_user, Expenses, Debts, Messages, Objectives, ObjectivesContributions, Group_payments
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Group, db.session))
    admin.add_view(ModelView(Group_to_user, db.session))
    admin.add_view(ModelView(Group_payments, db.session))
    admin.add_view(ModelView(Payments, db.session))
    admin.add_view(ModelView(Expenses, db.session))
    admin.add_view(ModelView(Debts, db.session))
    admin.add_view(ModelView(Messages, db.session))
    admin.add_view(ModelView(Objectives, db.session))
    admin.add_view(ModelView(ObjectivesContributions, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))