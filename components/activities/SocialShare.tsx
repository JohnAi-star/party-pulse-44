import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  return (
    <div className="flex items-center gap-4">
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <EmailShareButton url={url} subject={title} body={description}>
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
}