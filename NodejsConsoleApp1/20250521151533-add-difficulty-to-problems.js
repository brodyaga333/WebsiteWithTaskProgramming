module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Problems', 'difficulty', {
            type: Sequelize.ENUM('beginner', 'intermediate', 'expert'),
            allowNull: false,
            defaultValue: 'beginner'
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('Problems', 'difficulty');
    }
};