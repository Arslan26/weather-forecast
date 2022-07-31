const formatDateAMPM = date => {
    let hrs = date.getHours();
    let mints = date.getMinutes();
    const ampm = hrs >= 12 ? 'pm' : 'am';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    mints = mints < 10 ? '0'+mints : mints;
    return hrs + ':' + mints + ' ' + ampm;
}

const fetchDayName = dayNum => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum]
}

const padTo2Digits = num => num.toString().padStart(2, '0')


export const fetchHoursAMPM = date => {
    let hrs = date.getHours();
    const ampm = hrs >= 12 ? 'pm' : 'am';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    return hrs + ' ' + ampm;
}

export const validInput = value => value === '' || (/^\d+$/.test(value) && value.length <= 5)

export const fetchShortDayNameByDate = date => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
}

export const fetchDayAndTime = dateStr => {
    const date = new Date(dateStr);
    return`${fetchDayName(date.getDay())} ${formatDateAMPM(date)}`;
}

export const formatDateToStr = date =>
    [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
    ].join(':')
