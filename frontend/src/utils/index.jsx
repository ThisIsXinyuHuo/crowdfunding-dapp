export const daysRemaining = (deadline) => {
    const todaysdate = moment()
    days = Number((days + '000').slice(0))
    days = moment(days).format('YYYY-MM-DD')
    days = moment(days)
    days = days.diff(todaysdate, 'days')
    return days == 1 ? '1 day' : days + ' days'
}