import   {   Model,   DataTypes   }   from   'sequelize';
import   sequelize   from   '../database';


export   class   Ticket   extends   Model   {
  public   id!   :   number;
  public   topic!   :   string;
  public   description!   :   string;
  public   status!   :   string;
  public   resolution?   :   string;
  public   cancellationReason?   :   string;
  public   createdAt!   :   Date;
  public   updatedAt!   :   Date;
}


Ticket.init(
  {
    id:   {
      type:   DataTypes.INTEGER,
      autoIncrement:   true,
      primaryKey:   true,
    },

    topic:   {
      type:   DataTypes.STRING,
      allowNull:   false,
    },

    description:   {
      type:   DataTypes.TEXT,
      allowNull:   false,
    },

    status:   {
      type:   DataTypes.ENUM(   'Новое',   'В работе',   'Завершено',   'Отменено'   ),
      defaultValue:   'Новое',
    },

    resolution:   {
      type:   DataTypes.TEXT,
      allowNull:   true,
    },

    cancellationReason:   {
      type:   DataTypes.TEXT,
      allowNull:   true,
    },
  },

  {
    sequelize,
    modelName:   'Ticket',
  }
);


export   default   Ticket;