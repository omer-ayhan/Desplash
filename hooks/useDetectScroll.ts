import { useEffect, useRef, useState } from "react";

export const useElementOnScreen = (options?: IntersectionObserverInit) => {
	const containerRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);

	const callbackFunction = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		setIsVisible(entry.isIntersecting);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(callbackFunction, options);
		if (containerRef.current) observer.observe(containerRef.current);

		return () => {
			if (containerRef.current) observer.unobserve(containerRef.current);
		};
	}, [containerRef, options]);

	return [containerRef, isVisible];
};
