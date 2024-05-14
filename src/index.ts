interface Media {
    title: string
    href: string
    id: string
    filename?: string
    type: "google-drive" | "dropbox"
}

const posts = document.querySelectorAll('.postprofile + .postbody .content, #preview .postbody .content')

for (const post of posts) {
    const links = post.querySelectorAll(`
    .content > a[href^="https://drive.google.com/file/d/"],
    .content > :not(blockquote) a[href^="https://drive.google.com/file/d/"],
    .content > a[href^="https://www.dropbox.com/scl/fi/"][href$="&dl=0"]:is([href*=".mp3"], [href*=".mp4"],  [href*=".mov"], [href*=".m4a"], [href*=".m4v"], [href*="webm"]), 
    .content > :not(blockquote) a[href^="https://www.dropbox.com"][href$="&dl=0"]:is([href*=".mp3"], [href*=".mp4"], [href*=".mov"], [href*=".m4a"], [href*=".m4v"], [href*="webm"])
    `)
    if (!links.length)
        continue

    const media = [...links].map(l => {
        const href = l.getAttribute('href') as string

        let id: string
        let type: 'google-drive' | 'dropbox'
        let filename: string | undefined

        if (href.startsWith('https://drive.google.com')) {
            const match = /^https:\/\/drive.google.com\/file\/d\/([^/]+)/.exec(href)!

            id = match[1]
            type = 'google-drive'
        }

        else if (href.startsWith('https://www.dropbox.com')) {
            const match = /^https:\/\/www.dropbox.com\/scl\/fi\/([^/]+)\/(.+?)\?(.+)\&dl=0/.exec(href)!

            filename = match[2]
            id = `${match[1]}/${filename}?${match[3]}`

            type = 'dropbox'
        }

        else
            throw Error('Unknown media type')


        return {
            title: l.textContent ?? href,
            href,
            id,
            filename,
            type
        }
    })



    post.insertAdjacentHTML('afterend',
        `<div class='ivelt-media__root'>
        ${media.map(m => `
            <div class='links'>
                <a class='button'
                    href=${m.type === 'google-drive' ? 
                    `https://drive.google.com/uc?export=download&id=${m.id}`:
                    `https://www.dropbox.com/scl/fi/${m.id}&dl=1`}>
                <i class='icon fa-download'></i> דאונלאויד</a>
            </div>
            <div class='container'>
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
                    <source src='https://www.dropbox.com/scl/fi/${m.id}&dl=1'/>
                    Your browser does not support this content
                </video>`
            }
        </div>`).join('')}
    </div>`)
}
