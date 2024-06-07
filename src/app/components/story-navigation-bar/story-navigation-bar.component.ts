import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Publication, Storylist } from '@models/storylist.model';
import { StoryCard } from '@models/story.model';
import { AppRoutes } from '../../app.routes';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StoryEditionDateLabelComponent } from '../story-edition-date-label/story-edition-date-label.component';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MediaResourceTagsComponent } from '../media-resource-tags/media-resource-tags.component';
import { NavigablePublicationTeaserComponent } from '../navigable-publication-teaser/navigable-publication-teaser.component';

@Component({
	selector: 'cuentoneta-story-navigation-bar',
	templateUrl: './story-navigation-bar.component.html',
	standalone: true,
	imports: [
		CommonModule,
		NgxSkeletonLoaderModule,
		NgIf,
		NgFor,
		RouterLink,
		StoryEditionDateLabelComponent,
		MediaResourceTagsComponent,
		NavigablePublicationTeaserComponent,
	],
})
export class StoryNavigationBarComponent implements OnChanges {
	@Input() displayedPublications: Publication<StoryCard>[] = [];
	@Input() selectedStorySlug: string = '';
	@Input() storylist: Storylist | undefined;

	readonly appRoutes = AppRoutes;
	dummyList: null[] = Array(10);

	ngOnChanges(changes: SimpleChanges) {
		const storylist: Storylist = changes['storylist'].currentValue;
		if (!!storylist) {
			this.sliceDisplayedPublications(storylist.publications);
		}
	}

	/**
	 * Este método se encarga de mostrar la lista de publicaciones de la navbar en base a la story actualmente en vista.
	 * Si la storylist tiene más de 10 publicaciones, se muestran las 10 publicaciones más cercanas a la story actualmente
	 * en vista tomando las 5 publicaciones anteriores y las 5 siguientes en el caso por defecto y ajustando los límites en
	 * caso de que la story actualmente en vista sea una de las primeras o de las últimas.
	 * @author Ramiro Olivencia <ramiro@olivencia.com.ar>
	 */
	sliceDisplayedPublications(publications: Publication<StoryCard>[]): void {
		if (!this.storylist) {
			return;
		}

		const numberOfDisplayedPublications = 10;

		if (publications.length <= numberOfDisplayedPublications) {
			this.displayedPublications = publications;
			return;
		}

		const selectedStoryIndex = publications.findIndex(
			(publication) => publication.story.slug === this.selectedStorySlug,
		);

		const lowerIndex =
			selectedStoryIndex - numberOfDisplayedPublications / 2 < 0
				? 0
				: selectedStoryIndex - numberOfDisplayedPublications / 2;
		const upperIndex =
			selectedStoryIndex + numberOfDisplayedPublications / 2 > publications.length
				? publications.length
				: selectedStoryIndex + numberOfDisplayedPublications / 2;

		this.displayedPublications = this.storylist.publications.slice(
			upperIndex === publications.length ? publications.length - numberOfDisplayedPublications : lowerIndex,
			lowerIndex === 0 ? numberOfDisplayedPublications : upperIndex,
		);
	}
}
