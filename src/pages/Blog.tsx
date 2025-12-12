import { useState } from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    slug: 'role-of-advocacy',
    title: 'ROLE OF ADVOCACY IN VIOLENCE AGAINST WOMEN IN NIGERIA',
    image: '/assets/images/blog-hero-when-a-girl.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    featured: true,
  },
  {
    slug: 'navigating-domestic-violence',
    title: 'NAVIGATING DOMESTIC VIOLENCE LAWS AND STOCKHOLM SYNDROME IN VICTIMS',
    image: '/assets/images/NAVIGATING.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
  },
  {
    slug: 'securing-safety',
    title: 'SECURING SAFETY: A SIMPLE GUIDE TO OBTAINING RESTRAINING ORDERS AND PROTECTIVE MEASURES FOR ABUSED WOMEN IN NIGERIA.',
    image: '/assets/images/Securing Safety.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
  },
  {
    slug: 'child-custody',
    title: 'CHILD CUSTODY AND ABUSE: NAVIGATING THE COMPLEXITIES OF CHILD CUSTODY CASES INVOLVING ABUSIVE RELATIONSHIPS AND THE LEGAL STRATEGIES TO PROTECT CHILDREN',
    image: '/assets/images/CHILD CUSTODY.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
  },
  {
    slug: 'thriving-beyond-abuse',
    title: "THRIVING BEYOND ABUSE: THE ROLE OF FINANCIAL EMPOWERMENT IN WOMEN'S POST-ABUSE RECOVERY",
    image: '/assets/images/Thriving Beyond.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
  },
  {
    slug: 'legal-rights',
    title: 'LEGAL RIGHTS AND OPTIONS FOR WOMEN IN ABUSIVE MARRIAGES AND RELATIONSHIPS IN NIGERIA',
    image: '/assets/images/Legal Rights.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
  },
  {
    slug: 'recognizing-signs',
    title: 'RECOGNIZING THE SIGNS OF ABUSE: A GUIDE TO EMPOWERING NIGERIAN WOMEN IN IDENTIFYING HIDDEN VIOLENCE IN RELATIONSHIPS',
    image: '/assets/images/NAVIGATING.jpg',
    author: 'Oluwatoyin Omotayo',
    date: 'July 4, 2022',
    hidden: true,
  },
];

const Blog = () => {
  const [showAll, setShowAll] = useState(false);
  const featuredPost = blogPosts.find((p) => p.featured);
  const regularPosts = blogPosts.filter((p) => !p.featured);
  const visiblePosts = showAll ? regularPosts : regularPosts.filter((p) => !p.hidden);

  return (
    <>
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-8 lg:py-12">
          <div className="container">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="block relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden group"
            >
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute left-8 lg:left-12 right-8 lg:right-12 bottom-8 lg:bottom-12 text-white">
                <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 max-w-3xl">
                  {featuredPost.title}
                </h2>
                <div className="flex items-center gap-3 text-white/90">
                  <span>{featuredPost.author}</span>
                  <span className="w-1 h-1 rounded-full bg-white/60" />
                  <time>{featuredPost.date}</time>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Blog List */}
      <section className="py-8 lg:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePosts.map((post) => (
              <article key={post.slug}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block group"
                >
                  <div className="relative h-[200px] lg:h-[240px] rounded-xl overflow-hidden mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-foreground leading-tight mb-2 group-hover:text-green transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/60" />
                    <time>{post.date}</time>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Load More */}
          {regularPosts.some((p) => p.hidden) && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn bg-foreground text-background px-8 py-4 text-lg hover:bg-foreground/80 transition-colors"
              >
                {showAll ? 'Show Less' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
