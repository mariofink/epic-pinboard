export default function convertPost(post) {
  return {
    description: post.attributes.description,
    extended: post.attributes.extended,
    hash: post.attributes.hash,
    href: post.attributes.href,
    tag: post.attributes.tag,
    time: post.attributes.time,
  };
}
