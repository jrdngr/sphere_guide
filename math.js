export function realMod(n, m) {
    return ((n % m) + m) % m;
}

export function radians(angle) {
    return angle * (Math.PI / 180);
}

export function sphericalToPoint(radius, ascension, declination) {
    ascension = radians(ascension);
    declination = radians(declination);
    return {
        x: Math.sin(ascension) * Math.sin(declination) * radius,
        y: Math.cos(declination) * radius,
        z: Math.cos(ascension) * Math.sin(declination) * radius
    };
}

export function sphericalToCartesian(radius, theta, phi) {
    return {
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(theta),
    };
}

export function cartesianToSpherical(x, y, z) {
    return {
        r: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2)),
        theta: Math.atan2(y, x),
        phi: Math.atan2(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), z),
    }
}
