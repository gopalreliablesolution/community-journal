import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const postSlug = "ryu-oka-a-silk-route-table-at-11562-feet";

  const fullContentHtml = `
    <p class="lead" style="font-size: 18px; line-height: 1.7; color: #444; margin-bottom: 24px;">
      Long before it was a destination for travellers, Ladakh was a crossroads — a high, cold junction where caravans carrying silk, tea, and spice moved between India, Tibet, and Central Asia. <strong>RYU OKA</strong>, The Grand Dragon Ladakh's new Pan-Asian restaurant, is built around that history rather than around it.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
      For centuries, the trade routes that passed through Ladakh carried far more than goods — they carried recipes, spice combinations, and ways of cooking that moved with the caravans themselves, absorbed and adapted at every stop between Lhasa and Kashgar, Leh and Yarkand. RYU OKA takes that historical fact and turns it into a genuine dining concept: a Pan-Asian menu that moves across Japan, Korea, Thailand, China, and Bali, served in a dining room 11,562 feet above sea level, in the same town those old caravans once passed through.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 24px;">
      This is a restaurant with a clear point of view, and it's worth understanding in some detail — what's actually on the table, what opens the meal, what fills the glass, and why a five-star hotel in Leh chose to build something this specific rather than a safer, more generic international menu.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      The Idea Behind RYU OKA
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
      RYU OKA was developed specifically around the cultural and culinary exchanges of the historic Silk Route — not as a loose theme, but as an actual curatorial principle for the menu. Rather than picking one Asian cuisine and doing it well, the restaurant moves fluidly across several, in the same way goods and cooking styles once moved fluidly across the trade routes that ran through this exact region.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 24px;">
      It's a genuinely ambitious idea for a restaurant at this altitude and in this location, and it reflects something The Grand Dragon Ladakh has said directly about the opening: that RYU OKA is meant to expand Ladakh's dining experiences while staying connected to the region's own cultural and environmental character — not importing a generic Pan-Asian restaurant format wholesale, but building one that makes sense specifically here.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      How the Meal Begins
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
      Before the menu proper arrives, guests at RYU OKA are served a small, specific ritual: a shot of roasted barley water, warm and earthy, more grounding than a conventional welcome drink. It's a detail that does real work — barley has been a staple crop in Ladakh for centuries, roasted and ground into tsampa, brewed into local drinks, woven into the region's food culture long before any restaurant existed here. Opening a Pan-Asian meal with a distinctly Ladakhi gesture is exactly the kind of detail that separates a considered restaurant from a themed one.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      What's Actually on the Table
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 16px;">
      The kitchen at RYU OKA works local ingredients into a genuinely Pan-Asian repertoire — apricot, barley, sea buckthorn, and buckwheat appear across selected dishes, each one a crop that actually grows in this part of the Himalayas rather than an imported garnish.
    </p>

    <ul style="padding-left: 24px; margin-bottom: 24px; color: #333; font-size: 15px; line-height: 1.8;">
      <li style="margin-bottom: 8px;"><strong>Mongol Wrapped Tofu</strong> with collard greens and a relish that draws on Mongolian and Inner Central Asian cooking traditions.</li>
      <li style="margin-bottom: 8px;"><strong>RYU OKA Clay Pot:</strong> A restaurant's own signature preparation, served in the traditional clay pot style.</li>
      <li style="margin-bottom: 8px;"><strong>Truffle Fried Rice:</strong> A delicate bridge familiar Pan-Asian comfort food with a more refined, contemporary finish.</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 24px;">
      The through-line across the menu is a kitchen using genuine regional produce inside dishes that would otherwise read as purely international, which is precisely how a Silk Route menu should work.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      The Bar: Built for Altitude, Not Just for Flavour
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 16px;">
      RYU OKA's drinks programme takes Ladakh's elevation seriously rather than treating it as an afterthought.
    </p>

    <ul style="padding-left: 24px; margin-bottom: 24px; color: #333; font-size: 15px; line-height: 1.8;">
      <li style="margin-bottom: 8px;"><strong>Sea Buckthorn Spritz:</strong> A sharp, citrus-forward drink using locally harvested sea buckthorn berries.</li>
      <li style="margin-bottom: 8px;"><strong>Japanese Highballs:</strong> Crisp and effervescent, tailored specifically for high altitude sipping.</li>
      <li style="margin-bottom: 8px;"><strong>Hot Butter Tea and Kahwa:</strong> Traditional, warming local infusions served alongside the more international drinks list.</li>
    </ul>

    {/* Callout Box */}
    <div style="margin: 36px 0; padding: 28px 32px; background: #1A120B; color: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);">
      <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; color: #C89B3C; margin-top: 0; margin-bottom: 8px;">
        Reserve a Table at RYU OKA
      </h3>
      <p style="font-size: 14px; color: #E8E8E8; margin-bottom: 16px; line-height: 1.6;">
        A Pan-Asian Silk Route menu, Ladakhi frescos, and views of Stok Kangri — inside The Grand Dragon Ladakh.
      </p>
      <a href="tel:+918866911763" style="display: inline-block; padding: 10px 22px; background: linear-gradient(135deg, #C89B3C, #8B6914); color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 9999px; text-decoration: none;">
        Book Your Dining Experience →
      </a>
    </div>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      The Room Itself
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
      RYU OKA occupies a lobby-level space decorated with colourful, traditional Ladakhi frescos — a deliberate choice that keeps the room visually anchored to the region even as the menu ranges across Asia. A patio extends the dining space outward, with an expansive, uninterrupted view of the Stok Kangri mountain range.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      Why This Sits Inside a Five-Star Hotel in Leh
    </h2>
    <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 20px;">
      A restaurant this specific — sourcing local ingredients, building a drinks menu around altitude, opening every meal with a ritual rooted in Ladakhi food culture — requires exactly the kind of infrastructure and culinary ambition that a five-star property can support.
    </p>

    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1A1A; margin-top: 40px; margin-bottom: 16px;">
      Frequently Asked Questions
    </h2>
    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
      <div style="background: #FAF8F5; padding: 20px; border-radius: 12px; border: 1px solid #EFEFEF;">
        <h4 style="font-size: 16px; font-weight: 600; color: #1A1A1A; margin: 0 0 6px;">1. What kind of restaurant is RYU OKA?</h4>
        <p style="font-size: 14px; color: #6B6B6B; margin: 0; line-height: 1.6;">RYU OKA is a Pan-Asian restaurant at The Grand Dragon Ladakh, inspired by the historic Silk Route, bringing together the flavours of Japan, Korea, Thailand, China, and Bali.</p>
      </div>
      <div style="background: #FAF8F5; padding: 20px; border-radius: 12px; border: 1px solid #EFEFEF;">
        <h4 style="font-size: 16px; font-weight: 600; color: #1A1A1A; margin: 0 0 6px;">2. What are the signature dishes at RYU OKA?</h4>
        <p style="font-size: 14px; color: #6B6B6B; margin: 0; line-height: 1.6;">Mongol Wrapped Tofu with collard greens, the RYU OKA Clay Pot, and Truffle Fried Rice, alongside dishes incorporating apricot, sea buckthorn, and buckwheat.</p>
      </div>
      <div style="background: #FAF8F5; padding: 20px; border-radius: 12px; border: 1px solid #EFEFEF;">
        <h4 style="font-size: 16px; font-weight: 600; color: #1A1A1A; margin: 0 0 6px;">3. Where is RYU OKA located?</h4>
        <p style="font-size: 14px; color: #6B6B6B; margin: 0; line-height: 1.6;">On the lobby level of The Grand Dragon Ladakh, decorated with traditional Ladakhi frescos, with a patio offering views of the Stok Kangri mountain range.</p>
      </div>
    </div>
  `;

  await prisma.post.update({
    where: { slug: postSlug },
    data: {
      contentHtml: fullContentHtml.trim(),
    },
  });

  console.log("Updated Ryu Oka post content successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
