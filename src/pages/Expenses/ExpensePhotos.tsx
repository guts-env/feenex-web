import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

export default function ExpensePhotos({ photos }: { photos: string[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {photos.map((photo, index) => (
          <CarouselItem key={index}>
            <img src={photo} alt="Photo" className="w-full h-full object-cover" />
          </CarouselItem>
        ))}
      </CarouselContent>
      {photos.length > 1 && (
        <>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </>
      )}
    </Carousel>
  )
}
