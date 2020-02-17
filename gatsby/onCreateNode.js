const fs = require(`fs`);
const path = require(`path`);
const fetch = require('node-fetch');
const himalaya = require('himalaya');

// 获取用户的头像列表
const getAvatarList = async filename => {
  const sourcePath = 'https://github.com/jqxismygit/easy-component';
  const url = `${sourcePath}${filename}/list`;
  const html = await fetch(url).then(res => res.text());
  const ast = himalaya.parse(html)[0].children || [];
  return ast
    .map(item => {
      if (item.type === 'element') {
        const AlinkAST = item.children[1];
        const href = AlinkAST.attributes.find(({ key }) => key === 'href').value;
        const img = AlinkAST.children[1];
        const text = AlinkAST.children[2].content;
        const src = img.attributes.find(({ key }) => key === 'src').value;
        return {
          href,
          text,
          src,
        };
      }
      return null;
    })
    .filter(item => item && item.src);
};

const getKebabCase = str => {
  return str
    .replace(/[A-Z]/g, letter => {
      return `-${letter.toLowerCase()}`;
    })
    .replace(/\/-/g, '/');
};

const localePath = str => {
  str = str.replace('/index', '');
  if (str.includes('.zh-CN')) {
    str = str.replace('.zh-CN', '-cn');
  }
  if (str.includes('.en-US')) {
    str = str.replace('.en-US', '');
  }
  return str;
};

module.exports = async ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  switch (node.internal.type) {
    case 'MarkdownRemark':
      const { permalink } = node.frontmatter;
      let slug = permalink;
      const { absolutePath, sourceInstanceName, relativePath } = getNode(node.parent);
      const stats = fs.statSync(absolutePath);
      const mTime = new Date(stats.mtime).getTime();
      const mdFilePath = path.join(sourceInstanceName, relativePath);

      if (!slug) {
        slug = `${sourceInstanceName}/${relativePath.replace('.md', '')}`;
      }

      createNodeField({
        node,
        name: `modifiedTime`,
        value: mTime,
      });

      createNodeField({
        node,
        name: 'slug',
        value: getKebabCase(localePath(slug)),
      });

      createNodeField({
        node,
        name: 'underScoreCasePath',
        value: localePath(slug),
      });

      createNodeField({
        node,
        name: 'path',
        value: mdFilePath,
      });

      const html = await getAvatarList(mdFilePath) ;

      createNodeField({
        node,
        name: 'avatarList',
        value: [
          {
            href: '/jqxismygit',
            text: 'king',
            src: 'https://avatars1.githubusercontent.com/u/14227679?s=40&v=4'
          },
          ...html
        ]
      });
  }
};
