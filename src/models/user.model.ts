import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password: string;
  type: "creator" | "business" | "admin";
  verified: boolean;
  logo?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'verified' | 'logo' | 'stripeCustomerId' | 'stripeSubscriptionId' | 'subscriptionStatus' | 'subscriptionPlan'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public type!: "creator" | "business" | "admin";
  public verified!: boolean;
  public logo?: string;
  public stripeCustomerId?: string;
  public stripeSubscriptionId?: string;
  public subscriptionStatus?: string;
  public subscriptionPlan?: string;

  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM("creator","business","admin"),
          allowNull: false,
        },
        verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        logo: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        stripeCustomerId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        stripeSubscriptionId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        subscriptionStatus: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        subscriptionPlan: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
      }
    );
  }
}

export default User;
