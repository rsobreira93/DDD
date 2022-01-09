import { startOfHour } from 'date-fns';

import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentRepository: IAppointmentsRepository) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appoitmentDate = startOfHour(date);

    const findAppointmentInSameDate =
      await this.appointmentRepository.findByDate(appoitmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentRepository.create({
      provider_id,
      date: appoitmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
