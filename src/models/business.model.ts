import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface BusinessInfoAttributes {
	id: number;
	user_id: number;
	location: string;
	about: string;
	industry: string;
	total_employee: number;
	website: string;
	social: object;
}

interface BusinessInfoCreationAttributes
	extends Optional<BusinessInfoAttributes, "id" | "social"> {}

class BusinessInfo
	extends Model<BusinessInfoAttributes, BusinessInfoCreationAttributes>
	implements BusinessInfoAttributes
{
	public id!: number;
	public user_id!: number;
	public location!: string;
	public about!: string;
	public industry!: string;
	public total_employee!: number;
	public website!: string;
	public social!: object;

	static initialize(sequelize: Sequelize) {
		this.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				user_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				location: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				about: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				industry: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				total_employee: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				website: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				social: {
					type: DataTypes.ARRAY(DataTypes.JSONB),
					allowNull: true,
				},
			},
			{
				sequelize,
				modelName: "BusinessInfo",
			}
		);
	}

	static associate(models: any) {
		this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
	}
}

export default BusinessInfo;
