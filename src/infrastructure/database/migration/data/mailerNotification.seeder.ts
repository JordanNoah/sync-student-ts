import appConstants from "../../../../shared/constants";

export const MailerNotificationSeederData = [
    {
        name: appConstants.MAILER.NOTIFICATIONS.ACADEMICELEMENT_NAME_MISSING.NAME,
        abbreviation: appConstants.MAILER.NOTIFICATIONS.ACADEMICELEMENT_NAME_MISSING.ABBREVIATION,
        subject: 'Nombre de asignatura no encontrado',
        to: {beta: ['ct.accion.docente@funiber.org'], production: ['ct.accion.docente@funiber.org']},
        cc: null,
        cco: {beta: ['ct.accion.docente@funiber.org'], production: ['ct.accion.docente@funiber.org']}
    }
]