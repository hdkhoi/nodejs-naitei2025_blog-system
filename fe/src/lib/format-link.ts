const getArticleLink = (slug: string) => {
  return `/article/${slug}`;
};

const getProfileLink = (username: string) => {
  return `/profile/${username}`;
};

const getTagLink = (tagName: string) => {
  return `/tag/${tagName}`;
};

export { getArticleLink, getProfileLink, getTagLink };