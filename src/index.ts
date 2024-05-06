interface Media {
    title: string
    href: string
    id: string
    token?: string
    filename?: string
    type: "google-drive" | "dropbox"
}

const posts = document.querySelectorAll('.postprofile + .postbody .content, #preview .postbody .content')

for (const post of posts) {
    const links = post.querySelectorAll(`
    .content > a[href^="https://drive.google.com/file/d/"],
    .content > :not(blockquote) a[href^="https://drive.google.com/file/d/"],
    .content > a[href^="https://www.dropbox.com/scl/fi/"][href$="&dl=0"]:is([href*=".mp3"], [href*=".mp4"]), 
    .content > :not(blockquote) a[href^="https://www.dropbox.com"][href$="&dl=0"]:is([href*=".mp3"], [href*=".mp4"])
    `)
    if (!links.length)
        continue

    const media = [...links].map(l => {
        const href = l.getAttribute('href') as string

        let id: string
        let type: 'google-drive' | 'dropbox'
        let token: string | undefined
        let filename: string | undefined

        if (href.startsWith('https://drive.google.com')) {
            const match = /^https:\/\/drive.google.com\/file\/d\/([^/]+)/.exec(href)!

            id = match[1]
            type = 'google-drive'
        }

        else if (href.startsWith('https://www.dropbox.com')) {
            const match = /^https:\/\/www.dropbox.com\/scl\/fi\/([^/]+)\/(.+?)\?(.+)\&dl=0/.exec(href)!

            token = match[1]
            filename = match[2]
            id = `${token}/${filename}?${match[3]}`

            type = 'dropbox'
        }

        else
            throw Error('Unknown media type')


        return {
            title: l.textContent ?? href,
            href,
            id,
            token,
            filename,
            type
        }
    })



    post.insertAdjacentHTML('afterend',
        `<div class='ivelt-media__root'>
        ${media.map(m => `<div class='container'>
            ${m.type === 'google-drive' ?
                `<iframe 
                    src='https://drive.google.com/file/d/${m.id}/preview' 
                    frameborder='0' 
                    loading='lazy'
                    scrolling='no'
                    allowfullscreen>
                    Your browser does not support this content
                </iframe>`
                :
                `<video controls preview='metadata' filename=${m.filename}>
                    <source src='https://dl.dropbox.com/scl/fi/${m.id}'/>
                    Your browser does not support this content
                </video>`
            }
        </div>`).join('')}
    </div>`)
}