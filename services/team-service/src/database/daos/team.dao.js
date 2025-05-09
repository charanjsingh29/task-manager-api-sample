const { Team, TeamHasUser } = require('../models');
const { Op } = require('sequelize');
// const cache = require('../../libs/MemCache');

const isMineCondition = (userId) => {
    return {
        [Op.or]: [
            { manager_id: userId },
            { created_by: userId }
        ]
    }
}

const getTeams = async (userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const teams = await Team.findAll({
        where
    });
    return teams;
}

const getSingleTeam = async (teamId, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const team = await Team.findByPk(teamId, {
        where
    });
    return team;
}

const getTeamUsers = async (teamId, userId) => {
    let where = {};
    if(userId){
        where = isMineCondition(userId);
    }
    const team = await Team.findByPk(teamId, {
        where,
        include: [
            {
                model: TeamHasUser,
                as: 'users',
                attributes: ['user_id'],
                where: {
                    team_id: teamId
                }
            }
        ]
    });
    return team;
}

async function addUserToTeam(teamId, userIds) {
    const payload = userIds.map(user_id => ({
      team_id: teamId,
      user_id: user_id,
    }));
  
    await TeamHasUser.bulkCreate(payload, { ignoreDuplicates: true }); // or 'updateOnDuplicate' depending on use-case
}

async function removeUserFromTeam(teamId, userId) {
    await TeamHasUser.destroy({
      where: {
        team_id: teamId,
        user_id: userId,
      },
    });
}

module.exports = {
    getTeams,
    getSingleTeam,
    getTeamUsers,
    addUserToTeam,
    removeUserFromTeam
}