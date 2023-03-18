import React from "react";

export default function Home() {
	return (
		<div className="mx-auto max-w-4xl">
			<h3 className="mb-2 text-3xl">Masonry Design with TailwindCss</h3>

			<div className="lg:px-0 masonry-gap-4 lg:masonry-col-4">
				<div className="break-inside border p-3 mb-3 bg-green-600 text-white">
					<h2 className="text-2xl pb-2">First grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa ab
						exercitationem minus perspiciatis officiis quasi fuga aperiam
						repellendus modi natus.
					</p>
				</div>
				<div className="break-inside border p-3 mb-3 bg-blue-600 text-white">
					<h2 className="text-2xl pb-2">Second grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
				</div>

				<div className="break-inside border p-3 mb-3 bg-blue-500 text-white">
					<h2 className="text-2xl pb-2">Third grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
				</div>

				<div className="break-inside border p-3 mb-3 bg-indigo-500 text-white">
					<h2 className="text-2xl pb-2">Fourth grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
				</div>
				<div className="break-inside border p-3 mb-3 bg-yellow-600 text-white">
					<h2 className="text-2xl pb-2">Fifth grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
					<p>
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam,
						non.
					</p>
				</div>

				<div className="break-inside border p-3 mb-3 bg-red-500 text-white">
					<h2 className="text-2xl pb-2">Sixth grid item</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Accusantium, animi praesentium est ab a sint voluptatibus
						perspiciatis suscipit ex rerum.
					</p>
				</div>
			</div>
		</div>
	);
}
