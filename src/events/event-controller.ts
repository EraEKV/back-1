import { Request, Response } from 'express';
import { CreateEventDto } from './dtos/CreateEvent.dot';
import EventService from './event-service';

class EventController {
  private eventService : EventService;


  constructor(eventService : EventService){
      this.eventService = eventService;
  }

  private getPaginationAndSortingParams(req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const sortByRating = req.query.sortByRating as string || 'rating';
    const sortByDirection = req.query.sortByDirection as 'asc' | 'desc' || 'asc';
    return { page, limit, sortByRating, sortByDirection };
  } 


  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const createEventDto: CreateEventDto = req.body;
      const event = await this.eventService.createEvent(createEventDto);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }


  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sortByRating, sortByDirection } = this.getPaginationAndSortingParams(req);
      const events = await this.eventService.getEvents(page, limit, sortByRating, sortByDirection);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).send({ error: error.message }); 
    }
  }



  getEventById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const event = await this.eventService.getEventById(id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

  getEventsByCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user
      const userCity = user.city
      console.log(user)
      const events = await this.eventService.getEventsByCity(userCity);
      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).send({ error: error.message });
    }
  }

}


    
  // EventModel.paginate({}, 2, 10, function(error, pageCount, paginatedResults) {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log('Pages:', pageCount);
  //     console.log(paginatedResults);
  //   }
  // )}
// }

export default EventController;