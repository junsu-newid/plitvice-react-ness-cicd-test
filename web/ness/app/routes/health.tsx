export async function loader() {
    return new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } });
}
