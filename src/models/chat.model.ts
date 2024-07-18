import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ChatAttributes {
  id: number;
  sender_id: number;
  receiver_id: number;
  chats: object[];
  blockedBy?: number | null;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id" | "blockedBy"> {}

class Chat extends Model<ChatAttributes, ChatCreationAttributes> implements ChatAttributes {
  public id!: number;
  public sender_id!: number;
  public receiver_id!: number;
  public chats!: object[];
  public blockedBy?: number | null;

  static initialize(sequelize: Sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        sender_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        receiver_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'user_id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        chats: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        blockedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Chat",
      }
    );
  }
}

export default Chat;
