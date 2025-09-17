import { Image } from '@/components/ui/Image';
import { getImageSizes, blurPlaceholders } from '@/lib/image-utils';

// ...existing code...

function PortfolioCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-video">
        <Image
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          sizes={getImageSizes('card')}
          blurDataURL={blurPlaceholders.default}
        />
        // ...existing code...
      </div>
      // ...existing code...
    </Card>
  );
}