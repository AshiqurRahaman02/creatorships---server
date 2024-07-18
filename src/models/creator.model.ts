import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CreatorInfoAttributes {
  id: number;
  user_id: number;
  bio?: string;
  phone_number?: string;
  location?: string;
  languages?: string[];
  website?: string;
  social?: object;
}

interface CreatorInfoCreationAttributes
  extends Optional<
    CreatorInfoAttributes,
    "id" | "bio" | "phone_number" | "location" | "languages" | "website" | "social"
  > {}

class CreatorInfo
  extends Model<CreatorInfoAttributes, CreatorInfoCreationAttributes>
  implements CreatorInfoAttributes {
  public id!: number;
  public user_id!: number;
  public bio?: string;
  public phone_number?: string;
  public location?: string;
  public languages?: string[];
  public website?: string;
  public social?: object;

  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Users", // should be the name of the User table
            key: "user_id",
          },
        },
        bio: {
          type: DataTypes.TEXT,
        },
        phone_number: {
          type: DataTypes.STRING,
        },
        location: {
          type: DataTypes.STRING,
        },
        languages: {
          type: DataTypes.ARRAY(DataTypes.STRING),
        },
        website: {
          type: DataTypes.STRING,
        },
        social: {
          type: DataTypes.ARRAY(DataTypes.JSONB),
        },
      },
      {
        sequelize,
        modelName: "CreatorInfo",
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default CreatorInfo;
