const connection = require('../../db/connection');
const CustomError = require('../CustomError');

exports.getTopics = (req, res, next) => connection('topics')
  .select('*')
  .then(allTopics => res.status(200).send(allTopics))
  .catch(next);

exports.addTopic = (req, res, next) => {
  const newTopic = {
    slug: req.body.slug,
    description: req.body.description || '',
  };

  return connection('topics')
    .insert(newTopic)
    .returning(['slug', 'description'])
    .then(createdTopic => res.status(201).send(createdTopic))
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;

  return connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .where('topic', '=', topic)
    .count('comments.article_id AS comment_count')
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'comments.article_id',
    )
    .then(matchingArticles => res.status(200).send(matchingArticles))
    .catch(next);
};
