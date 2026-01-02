import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

export interface CalendarEvent {
    summary: string;
    description: string;
    location?: string | null
    startDateTime: Date;
    endDateTime: Date;
    attendees?: string[];
    reminders?: {
        useDefault: boolean;
        overrides?: Array<{
        method: 'email' | 'popup';
        minutes: number;
        }>;
    };
}

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private calendar;

  constructor(private configService: ConfigService) {
    this.initializeCalendar();
  }

  private async initializeCalendar() {
    try {
      const auth = new google.auth.JWT({
        email: this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        key: this.configService
          .get<string>('GOOGLE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.logger.log('✅ Google Calendar initialized successfully');
    } catch (error) {
      this.logger.error('❌ Failed to initialize Google Calendar', error);
    }
  }

  async createEvent(eventData: CalendarEvent): Promise<string | null> {
    try {
      const event = {
        summary: eventData.summary,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startDateTime.toISOString(),
          timeZone: 'America/Recife',
        },
        end: {
          dateTime: eventData.endDateTime.toISOString(),
          timeZone: 'America/Recife',
        },
        attendees: eventData.attendees?.map((email) => ({ email })),
        reminders: eventData.reminders || {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 dia antes
            { method: 'popup', minutes: 120 }, // 2 horas antes
          ],
        },
        colorId: '5', // Cor amarela (destaque)
      };

      const response = await this.calendar.events.insert({
        calendarId: this.configService.get<string>('GOOGLE_CALENDAR_ID'),
        resource: event,
      });

      this.logger.log(`✅ Event created: ${response.data.id}`);
      return response.data.id;
    } catch (error) {
      this.logger.error('❌ Failed to create calendar event', error);
      return null;
    }
  }

  async updateEvent(
    eventId: string,
    eventData: Partial<CalendarEvent>,
  ): Promise<boolean> {
    try {
      const updateData: any = {};

      if (eventData.summary) updateData.summary = eventData.summary;
      if (eventData.description) updateData.description = eventData.description;
      if (eventData.startDateTime) {
        updateData.start = {
          dateTime: eventData.startDateTime.toISOString(),
          timeZone: 'America/Recife',
        };
      }
      if (eventData.endDateTime) {
        updateData.end = {
          dateTime: eventData.endDateTime.toISOString(),
          timeZone: 'America/Recife',
        };
      }

      await this.calendar.events.patch({
        calendarId: this.configService.get<string>('GOOGLE_CALENDAR_ID'),
        eventId: eventId,
        resource: updateData,
      });

      this.logger.log(`✅ Event updated: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('❌ Failed to update calendar event', error);
      return false;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await this.calendar.events.delete({
        calendarId: this.configService.get<string>('GOOGLE_CALENDAR_ID'),
        eventId: eventId,
      });

      this.logger.log(`✅ Event deleted: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('❌ Failed to delete calendar event', error);
      return false;
    }
  }

  async listUpcomingEvents(maxResults: number = 10) {
    try {
      const response = await this.calendar.events.list({
        calendarId: this.configService.get<string>('GOOGLE_CALENDAR_ID'),
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      this.logger.error('❌ Failed to list calendar events', error);
      return [];
    }
  }

    async updateEventWithColor(
        eventId: string,
        eventData: Partial<CalendarEvent>,
        colorId?: string,
    ): Promise<boolean> {
        try {
            const updateData: any = {};

            if (eventData.summary) updateData.summary = eventData.summary;
            if (eventData.description) updateData.description = eventData.description;
            if (colorId) updateData.colorId = colorId;

            if (eventData.startDateTime) {
                updateData.start = {
                    dateTime: eventData.startDateTime.toISOString(),
                    timeZone: 'America/Recife',
                };
            }
            if (eventData.endDateTime) {
                updateData.end = {
                    dateTime: eventData.endDateTime.toISOString(),
                    timeZone: 'America/Recife',
                };
            }

            await this.calendar.events.patch({
                calendarId: this.configService.get<string>('GOOGLE_CALENDAR_ID'),
                eventId: eventId,
                resource: updateData,
            });

            this.logger.log(`✅ Event updated with color: ${eventId}`);
            return true;
        } catch (error) {
            this.logger.error('❌ Failed to update calendar event', error);
            return false;
        }
    }

}
