/**
 * WikipediaAttribution - Shows Wikipedia source attribution
 *
 * Displays a Wikipedia "W" icon with tooltip linking to the source article.
 * Opens in new tab with appropriate security attributes.
 */

import { sanitizeUrl } from '@utils';
import './WikipediaAttribution.css';

interface WikipediaAttributionProps {
  /** URL to the Wikipedia article */
  wikipediaUrl: string;
  /** Optional: Show as inline link instead of icon only */
  variant?: 'icon' | 'link' | 'inline';
  /** Optional: Size of the icon */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Wikipedia "W" logo as an inline SVG
 * Simplified version based on the Wikipedia globe icon
 */
function WikipediaIcon({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeMap = {
    small: 14,
    medium: 16,
    large: 20,
  };
  const dimension = sizeMap[size];

  return (
    <svg
      className="wikipedia-attribution__icon"
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Stylized "W" for Wikipedia */}
      <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264c-.189-.34-.316-.559-.378-.651-.103-.164-.339-.262-.71-.295l-.464-.033c-.181-.009-.272-.064-.272-.18V5.94l.054-.045h4.521l.054.045v.428c0 .105-.06.164-.18.176l-.455.033c-.391.015-.586.126-.586.334 0 .084.028.198.09.345l1.693 3.749 1.67-3.355c.105-.227.163-.399.163-.518 0-.254-.183-.39-.556-.408l-.558-.033c-.166-.009-.246-.064-.246-.176V5.94l.054-.045c.312.003 2.769 0 3.443 0l.054.045v.428c0 .119-.075.176-.21.176l-.328.031c-.308.015-.564.089-.756.227-.195.135-.375.345-.538.645l-2.592 5.093 2.872 5.769.134.046 4.587-10.305c.12-.271.18-.483.18-.636 0-.254-.195-.39-.583-.408l-.552-.033c-.166-.009-.246-.064-.246-.176V5.94l.054-.045c.312.003 2.629 0 3.307 0l.054.045v.428c0 .119-.075.176-.21.176l-.345.031c-.325.024-.586.115-.785.271-.198.153-.39.417-.571.79-2.034 4.271-5.541 11.648-5.541 11.648-.393.889-.871.937-1.37.074-.591-1.032-2.098-3.955-2.851-5.528l-.136-.046z" />
    </svg>
  );
}

function WikipediaAttribution({
  wikipediaUrl,
  variant = 'icon',
  size = 'medium',
}: WikipediaAttributionProps) {
  // SECURITY: sanitize URL (F4/F6)
  const safeUrl = sanitizeUrl(wikipediaUrl);

  if (variant === 'link') {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wikipedia-attribution wikipedia-attribution--link"
        title="View on Wikipedia"
      >
        <WikipediaIcon size={size} />
        <span>Wikipedia</span>
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wikipedia-attribution wikipedia-attribution--inline"
        title="Read more on Wikipedia"
      >
        Read more on Wikipedia
        <svg
          className="wikipedia-attribution__external"
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      </a>
    );
  }

  // Default: icon only
  return (
    <a
      href={safeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="wikipedia-attribution wikipedia-attribution--icon"
      title="Source: Wikipedia"
    >
      <WikipediaIcon size={size} />
    </a>
  );
}

export default WikipediaAttribution;
