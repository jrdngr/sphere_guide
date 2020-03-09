export function realMod(n, m) {
    return ((n % m) + m) % m;
}

export function radians(angle) {
    return angle * (Math.PI / 180);
}

export function sphericalToPoint(radius, ascension, declination) {
    ascension = radians(ascension);
    declination = radians(declination);
    return [
        Math.sin(ascension) * Math.sin(declination) * radius,
        Math.cos(declination) * radius,
        Math.cos(ascension) * Math.sin(declination) * radius
    ];
}
