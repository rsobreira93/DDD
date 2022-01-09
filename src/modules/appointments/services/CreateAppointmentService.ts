import {startOfHour} from 'date-fns';
import { getCustomRepository } from "typeorm";

import AppointmentsRepository from "../repositories/AppointmentsRepository";
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

import AppError from '@shared/errors/AppError';

interface Request{
    provider_id: string;
    date: Date;
}

class CreateAppointmentService{

    public async execute({date, provider_id}:Request): Promise<Appointment>{
        const appointmentsRepositoty = getCustomRepository(AppointmentsRepository);

        const appoitmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepositoty.findByDate(
            appoitmentDate,
        );

        if(findAppointmentInSameDate){
            throw new AppError('This appointment is already booked');
        }

        const appointment = appointmentsRepositoty.create({
            provider_id,
            date: appoitmentDate
        });

        await appointmentsRepositoty.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
