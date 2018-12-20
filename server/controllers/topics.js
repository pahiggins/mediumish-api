/* eslint-disable consistent-return */
const connection = require('../../db/connection');

exports.getTopics = (req, res, next) => connection('topics')
  .select('*')
  .then(allTopics => res.status(200).send(allTopics))
  .catch(next);

exports.addTopic = (req, res, next) => {
  let slug;
  let description;

  if (typeof req.body.slug === 'string') {
    slug = req.body.slug.trim();
  }

  if (typeof req.body.description === 'string') {
    description = req.body.description.trim();
  }

  const newTopic = {
    slug,
    description,
  };

  return connection('topics')
    .insert(newTopic)
    .returning(['slug', 'description'])
    .then(([addedTopic]) => {
      res.status(201).send(addedTopic);
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = false,
  } = req.query;

  return connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .limit(limit)
    .offset(p * limit)
    .orderBy((`articles.${sort_by}`), sort_ascending ? 'asc' : 'desc')
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
    .then((matchingArticles) => {
      if (matchingArticles.length === 0) return Promise.reject({ status: 404, msg: 'article not found' });
      res.status(200).send(matchingArticles);
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  const { topic } = req.params;
  const newArticle = {
    title: req.body.title,
    body: req.body.body || '',
    username: req.body.username,
    topic,
  };

  return connection('articles')
    .insert(newArticle)
    .returning('*')
    .then((addedArticle) => {
      res.status(201).send(addedArticle);
    })
    .catch(next);
};
