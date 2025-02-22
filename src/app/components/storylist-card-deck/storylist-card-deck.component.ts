// Core
import { ChangeDetectionStrategy, Component, inject, input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Modules
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';

// Models
import { GridItemPlacementConfig, Storylist } from '@models/storylist.model';
import { AppRoutes } from '../../app.routes';
import { StorylistGridSkeletonConfig } from '@models/content.model';
import { PublicationCardComponent } from '../publication-card/publication-card.component';
import { ThemeService } from '../../providers/theme.service';
import { StoryCardSkeletonComponent } from '../story-card-skeleton/story-card-skeleton.component';

@Component({
	selector: 'cuentoneta-storylist-card-deck',
	standalone: true,
	imports: [CommonModule, NgxSkeletonLoaderModule, RouterLink, PublicationCardComponent, StoryCardSkeletonComponent],
	templateUrl: './storylist-card-deck.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorylistCardDeckComponent implements OnChanges {
	number = input<number>(6);
	storylist = input<Storylist>();
	isLoading = input<boolean>(false); // Utilizado para mostrar/ocultar skeletons
	canNavigateToStorylist = input<boolean>(false);
	displayTitle = input<boolean>(true);
	displayFeaturedImage = input<boolean>(true);
	skeletonConfig = input<StorylistGridSkeletonConfig>();

	public router = inject(Router);

	imagesCardConfig: { [key: string]: CardDeckCSSGridConfig } = {};
	storiesCardConfig: { [key: string]: CardDeckCSSGridConfig } = {};
	readonly appRoutes = AppRoutes;

	private themeService = inject(ThemeService);
	skeletonColor = this.themeService.pickColor('zinc', 300);

	ngOnChanges(changes: SimpleChanges) {
		if (!!changes['storylist'] && !!changes['storylist'].currentValue) {
			this.generateStoriesCardConfig();
			this.generateImagesCardConfig();
		}
	}

	private generateImagesCardConfig() {
		const cardsPlacement: GridItemPlacementConfig[] | undefined = this.storylist()?.gridConfig?.cardsPlacement;

		if (!cardsPlacement) {
			return;
		}
		const parsedConfigs = cardsPlacement
			.filter((card) => !!card.imageSlug)
			.map((card) => {
				return {
					slug: card.imageSlug,
					...this.generateCardConfig(card.imageSlug as string),
				};
			});

		for (const config of parsedConfigs) {
			const { slug, ...other } = config;
			this.imagesCardConfig[slug as string] = other;
		}
	}

	private generateStoriesCardConfig() {
		const cardsPlacement: GridItemPlacementConfig[] | undefined = this.storylist()?.gridConfig?.cardsPlacement;

		if (!cardsPlacement) {
			return;
		}

		const parsedConfigs = cardsPlacement
			.filter((card) => !!card.slug)
			.map((card) => {
				return {
					slug: card.slug,
					...this.generateCardConfig(card.slug as string),
				};
			});

		for (const config of parsedConfigs) {
			const { slug, ...other } = config;
			this.storiesCardConfig[slug as string] = other;
		}
	}

	private generateCardConfig(slug: string): CardDeckCSSGridConfig {
		const storyCardConfig = this.storylist()?.gridConfig?.cardsPlacement?.find((card) =>
			[card.slug, card.imageSlug].includes(slug),
		);
		return {
			order: storyCardConfig?.order ?? 2,
			'grid-column-start': storyCardConfig?.startCol ?? 'auto',
			'grid-column-end': storyCardConfig?.endCol ?? 'span 4',
		};
	}
}

interface CardDeckCSSGridConfig {
	order: number;
	'grid-column-start': string | number;
	'grid-column-end': string | number;
	'grid-row-start'?: string | number;
	'grid-row-end'?: string | number;
}
