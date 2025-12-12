import { useParams, Link } from 'react-router-dom';

const blogContent: Record<string, {
  title: string;
  author: string;
  date: string;
  image: string;
  content: string[];
  prev?: string;
  next?: string;
}> = {
  'role-of-advocacy': {
    title: 'ROLE OF ADVOCACY IN VIOLENCE AGAINST WOMEN IN NIGERIA',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/blog-hero-when-a-girl.jpg',
    content: [
      'Violence against women is a critical issue that requires urgent attention and awareness, particularly in Nigeria where various forms of violence are prevalent. It is crucial to recognise that any act of violence against any person, regardless of gender, is a crime. However, statistics indicate that women are mostly affected by various forms of violence.',
      'The most common forms of Violence Against Women include but not limited to:',
      '1. Genital Mutilation - A harmful practice that affects many women and girls, often leading to severe physical and psychological consequences.',
      '2. Rape and Sexual Assault - A heinous act that is unfortunately common and can have devastating effects on victims, both physically and emotionally.',
      '3. Physical Assault - This includes domestic violence and other forms of physical harm directed towards women.',
      '4. Economic Abuse - This form of violence restricts women\'s financial independence and access to resources, which can be just as damaging as physical violence. This is so systemically done to disenfranchise women from financial freedom in order to hold her in the state of perpetual abuse.',
      '5. Discrimination and Verbal Abuse - Women often face systemic discrimination and verbal abuse, which contribute to a culture of violence and oppression.',
      '6. Child Marriage - This practice not only violates the rights of young girls but also exposes them to various forms of violence and abuse.',
      'Violence against women has grown into a multifaceted issue that extends beyond the above mentioned. It now encompasses various forms of abuse, including cyber violence, which has become increasingly prevalent in recent years. This includes acts such as revenge porn, where intimate images are shared without consent, and child pornography, which exploits vulnerable individuals. Additionally, trafficking remains a significant concern, further complicating the landscape of violence against women.',
      'Domestic violence is a global issue that transcends geographical boundaries. In Nigeria, the laws against these acts of violence exist, yet enforcement and societal attitudes often hinder their effectiveness. The Violence Against Persons Prohibition Act (VAPP) 2015 is a critical piece of legislation that explicitly defines acts of violence as crimes, outlining that such behaviours are punishable offences.',
      'Advocacy plays a crucial role in the fight against domestic violence, especially in contexts where victims are often unaware of their rights and the legal protections available to them. In Nigeria, domestic violence is notably prevalent among less educated populations. Many victims may not recognize that they are experiencing a crime, and even if they do, they often lack knowledge about the steps to take for seeking justice.',
      'The fight against domestic violence in Nigeria requires a concerted effort to promote awareness, educate and empower victims, and ensure that legal protections are effectively enforced. Advocacy is not just about raising awareness; it\'s about creating tangible change in the lives of those affected.',
      'In conclusion, addressing Violence against women in Nigeria is a complex issue that requires not just continuous dialogue and education, but also enforcement of existing laws on Domestic violence and abuse, establishment of reliable support systems which may include provision of temporary shelter for victims, legal protections, and most importantly empowerment of victims and survivors.',
    ],
    next: 'navigating-domestic-violence',
  },
  'navigating-domestic-violence': {
    title: 'NAVIGATING DOMESTIC VIOLENCE LAWS AND STOCKHOLM SYNDROME IN VICTIMS',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/NAVIGATING.jpg',
    content: [
      'Domestic violence is a pervasive issue that affects millions of individuals worldwide, transcending cultural, economic, and social boundaries. Understanding the legal frameworks designed to protect victims is crucial, yet it is equally important to recognize the psychological complexities that often prevent victims from seeking help.',
      'Stockholm Syndrome, a psychological phenomenon where hostages develop positive feelings toward their captors, can similarly affect domestic violence victims. This complex emotional bond can make it incredibly difficult for victims to leave abusive relationships, even when they have access to legal protections.',
      'Nigerian law provides several mechanisms for protection, including the Violence Against Persons Prohibition Act (VAPP) 2015, which criminalizes various forms of domestic violence. However, the effectiveness of these laws depends heavily on enforcement and the willingness of victims to come forward.',
      'Understanding the intersection of legal protections and psychological barriers is essential for anyone working to support domestic violence survivors. Advocacy must address both the legal and emotional needs of victims to be truly effective.',
    ],
    prev: 'role-of-advocacy',
    next: 'securing-safety',
  },
  'securing-safety': {
    title: 'SECURING SAFETY: A SIMPLE GUIDE TO OBTAINING RESTRAINING ORDERS AND PROTECTIVE MEASURES FOR ABUSED WOMEN IN NIGERIA',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/Securing Safety.jpg',
    content: [
      'For women experiencing domestic violence, obtaining a restraining order can be a crucial step toward safety. This guide provides a simplified overview of the process in Nigeria.',
      'A protection order is a legal document issued by a court that prohibits an abuser from contacting or approaching the victim. In Nigeria, these orders can be obtained through various courts depending on the state.',
      'The first step is to report the abuse to the police and obtain a medical report if there are physical injuries. Document all incidents of abuse, including dates, times, and any witnesses.',
      'To apply for a protection order, visit the nearest magistrate court with your documentation. Many courts have family courts or special units that handle domestic violence cases.',
      'Remember that seeking help is a sign of strength, not weakness. Various organizations, including The Olanike Omopariola Foundation, are available to provide support and guidance throughout this process.',
    ],
    prev: 'navigating-domestic-violence',
    next: 'child-custody',
  },
  'child-custody': {
    title: 'CHILD CUSTODY AND ABUSE: NAVIGATING THE COMPLEXITIES OF CHILD CUSTODY CASES INVOLVING ABUSIVE RELATIONSHIPS',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/CHILD CUSTODY.jpg',
    content: [
      'Child custody cases involving domestic violence present unique challenges that require careful navigation. The safety of both the child and the non-abusive parent must be the primary consideration.',
      'Nigerian law recognizes the best interest of the child as the paramount consideration in custody matters. When abuse is involved, courts are increasingly considering evidence of domestic violence when making custody decisions.',
      'Documentation is crucial in these cases. Keep records of all incidents of abuse, including photographs, medical records, and police reports. These can serve as evidence in custody proceedings.',
      'Working with a lawyer who specializes in family law and understands domestic violence dynamics is essential. Legal advocates can help ensure that the court fully understands the impact of abuse on both the parent and child.',
    ],
    prev: 'securing-safety',
    next: 'thriving-beyond-abuse',
  },
  'thriving-beyond-abuse': {
    title: "THRIVING BEYOND ABUSE: THE ROLE OF FINANCIAL EMPOWERMENT IN WOMEN'S POST-ABUSE RECOVERY",
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/Thriving Beyond.jpg',
    content: [
      'Financial abuse is one of the most common yet least discussed forms of domestic violence. Abusers often use financial control to maintain power over their victims, making it difficult for survivors to leave.',
      'Breaking free from an abusive relationship often requires financial independence. This includes having access to personal funds, understanding financial management, and developing income-generating skills.',
      'Many organizations offer programs specifically designed to help survivors rebuild their financial lives. These may include job training, micro-loans, and financial literacy education.',
      'The Olanike Omopariola Foundation provides support for survivors through various empowerment programs, helping women develop the skills and resources they need to build independent lives.',
      'Recovery is a journey, and financial empowerment is just one piece of the puzzle. Emotional support, community connection, and continued advocacy all play important roles in helping survivors thrive.',
    ],
    prev: 'child-custody',
    next: 'legal-rights',
  },
  'legal-rights': {
    title: 'LEGAL RIGHTS AND OPTIONS FOR WOMEN IN ABUSIVE MARRIAGES AND RELATIONSHIPS IN NIGERIA',
    author: 'Oluwatoyin Omotayo',
    date: 'August 19, 2022',
    image: '/assets/images/Legal Rights.jpg',
    content: [
      'Women in Nigeria have legal rights that protect them from abuse, though many are unaware of these protections. Understanding your rights is the first step toward safety.',
      'The Constitution of Nigeria guarantees the right to life, dignity, and freedom from torture or inhuman treatment. These fundamental rights apply to all women, regardless of marital status.',
      'The Violence Against Persons Prohibition Act (VAPP) 2015 specifically criminalizes domestic violence, making it a punishable offense. This includes physical violence, emotional abuse, and economic deprivation.',
      'Under Nigerian law, women have the right to seek divorce on grounds of cruelty or abuse. Courts can also award custody of children to the non-abusive parent and order the payment of maintenance.',
      'Various support organizations, including TOOF, provide legal assistance and advocacy for women seeking to exercise their rights. You are not alone in this journey.',
    ],
    prev: 'thriving-beyond-abuse',
    next: 'recognizing-signs',
  },
  'recognizing-signs': {
    title: 'RECOGNIZING THE SIGNS OF ABUSE: A GUIDE TO EMPOWERING NIGERIAN WOMEN IN IDENTIFYING HIDDEN VIOLENCE IN RELATIONSHIPS',
    author: 'Oluwatoyin Omotayo',
    date: 'July 4, 2022',
    image: '/assets/images/NAVIGATING.jpg',
    content: [
      'Abuse often begins subtly and escalates over time. Recognizing the early warning signs can help women protect themselves before the situation worsens.',
      'Emotional abuse may include constant criticism, humiliation, or attempts to isolate you from friends and family. These behaviors are often precursors to physical violence.',
      'Financial control—such as limiting access to money, sabotaging employment, or controlling all financial decisions—is a form of abuse designed to create dependency.',
      'Physical violence is never acceptable, regardless of circumstances. Any partner who uses physical force, no matter how "minor," is crossing a serious line.',
      'Trust your instincts. If something feels wrong in your relationship, it probably is. Seeking advice from trusted friends, family, or professionals can help you evaluate your situation.',
    ],
    prev: 'legal-rights',
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" className="btn btn-green px-8 py-4">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Image */}
      <section className="w-full">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />
      </section>

      {/* Title & Meta */}
      <section className="py-8 lg:py-12">
        <div className="container max-w-4xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <time>{post.date}</time>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="pb-16 lg:pb-24">
        <div className="container max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Navigation */}
          <nav className="flex justify-between items-center pt-12 mt-12 border-t border-border">
            {post.prev ? (
              <Link
                to={`/blog/${post.prev}`}
                className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-green transition-colors"
              >
                <span className="text-2xl">‹</span>
                <span>Previous</span>
              </Link>
            ) : (
              <Link
                to="/blog"
                className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-green transition-colors"
              >
                <span className="text-2xl">‹</span>
                <span>Back to Blog</span>
              </Link>
            )}

            {post.next && (
              <Link
                to={`/blog/${post.next}`}
                className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-green transition-colors"
              >
                <span>Next</span>
                <span className="text-2xl">›</span>
              </Link>
            )}
          </nav>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
