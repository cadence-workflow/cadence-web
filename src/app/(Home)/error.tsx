"use client"
export default function HomePageError({
    error
}: Readonly<{
    error: Error;
}>) {
    return (
        <div>
            A problem {error.message}
        </div>
    );
}
