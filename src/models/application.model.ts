import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ApplicationAttributes {
	id: number;
	userId: number;
	heading: string;
	pricing: string;
	endDate: string;
	experience: string;
	about: string;
	languages: string[];
	benefits: string;
	no_of_openings: number;
}

interface ApplicationiCreationAttributes
	extends Optional<ApplicationAttributes, "id" | "benefits"> {}

class Application
	extends Model<ApplicationAttributes, ApplicationiCreationAttributes>
	implements ApplicationAttributes
{
	[x: string]: any;
	public id!: number;
	public userId!: number;
	public heading!: string;
	public pricing!: string;
	public endDate!: string;
	public experience!: string;
	public about!: string;
	public languages!: string[];
	public benefits!: string;
	public no_of_openings!: number;

	static initialize(sequelize: Sequelize) {
		this.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				userId: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
				heading: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				pricing: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				endDate: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				experience: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				about: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				languages: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					allowNull: true,
				},
				benefits: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				no_of_openings: {
					type: DataTypes.INTEGER,
					allowNull: false,
				},
			},
			{
				sequelize,
				modelName: "Application",
			}
		);
	}

	static associate(models: any) {
		this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
	}
}

export default Application;
