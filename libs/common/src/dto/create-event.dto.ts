import { IsInt, IsNotEmpty, IsString, Max, Min, IsUUID, IsDate, IsOptional } from "class-validator";

export class CreateEventDto {
    @IsString({message: 'Title must be a string'}) 
    @IsNotEmpty({message: 'Title is required'})
    title: string;

    @IsString({message: 'Description must be a string'}) 
    @IsNotEmpty({message: 'Description is required'})
    description: string;

    @IsString({message: 'Location must be a string'}) 
    @IsNotEmpty({message: 'Location is required'})
    location: string;

    @IsInt({message: 'Capacity must be an integer'}) 
    @Min(1, { message: 'Capacity must be at least 1' })
    capacity: number;

    @IsInt({message: 'Price must be an integer'}) 
    @Min(0, { message: 'Price must be at least 0' })
    @Max(1000000, { message: 'Price must be at most 1000000' })
    price: number;

    @IsUUID('all', {message: 'OrganizerId must be a uuid'}) 
    @IsNotEmpty({message: 'OrganizerId is required'})
    organizerId: string;

    @IsDate({message: 'Date must be a date'}) 
    @IsOptional()
    date: Date;
}
