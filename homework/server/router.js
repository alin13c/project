//server/router.js
const Router = require('koa-router');
const { addData, getData, editData, delData } = require('./controller/data');
const {
  addTag,
  getTags,
  editTag,
  searchTag,
  delTag,
} = require('./controller/tag');
const { setLang, getLang } = require('./controller/lang');

const router = new Router();

// 定义数据路由
router.post('/api/data', addData);
router.get('/api/data', getData);
router.put('/api/data/:id', editData); // 注意这里的更改，增加了:id
router.delete('/api/data', delData);

// 定义切换语言接口
router.post('/api/lang', setLang);
router.get('/api/lang', getLang);

// 定义标签路由
router.post('/api/tags', addTag);
router.get('/api/tags', getTags);
//router.put('/api/tags', editTag);
router.delete('/api/tags', delTag);
router.put('/api/tags/:id', editTag);
router.get('/api/tags', searchTag);

module.exports = router;
