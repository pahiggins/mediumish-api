const {
  articleData, topicData, userData, commentData,
} = require('../data');

const {
  formatArticleData, formatCommentData,
} = require('../utils');

exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(() => knex('users').insert(userData))
    .then(() => knex('topics').del())
    .then(() => knex('topics').insert(topicData))
    .then(() => knex('articles').del())
    .then(() => {
      const formattedArticleData = formatArticleData(articleData);

      return knex('articles').returning(['article_id', 'title']).insert(formattedArticleData);
    })
    .then((articles) => {
      knex('comments').del();
      return articles;
    })
    .then((articles) => {
      const formattedCommentData = formatCommentData(commentData, articles);

      return knex('comments').insert(formattedCommentData);
    })
    .catch();
};
