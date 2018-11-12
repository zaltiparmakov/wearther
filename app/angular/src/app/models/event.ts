export interface Event {
    id: number;
    title: String;
    description: String;
    picture: String;
    created_at: Date;
    start_date: Date;
    start_time: Date;
    end_date: Date;
    end_time: Date;
    location: String;
    users_going: [{}];
    organizer: String;
    comments: [{}];
    canceled: Boolean;
}
