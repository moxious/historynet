/**
 * SchemaOrg - Dynamic JSON-LD structured data for SEO
 *
 * Renders Schema.org structured data as JSON-LD script tags via react-helmet-async.
 * Used on detail pages to provide rich metadata for search engines and AI systems.
 *
 * Note: In a pure SPA without server-side rendering, this updates client-side only.
 * For full SEO benefit, consider SSR or prerendering services.
 */

import { Helmet } from 'react-helmet-async';
import type { GraphNode, PersonNode, ObjectNode, LocationNode, EntityNode } from '@types';
import { isPersonNode, isObjectNode, isLocationNode } from '@types';

const PRODUCTION_BASE_URL = 'https://moxious.github.io/historynet';

interface SchemaOrgProps {
  /** The node to generate structured data for */
  node: GraphNode;
  /** Dataset ID for building URLs */
  datasetId: string;
  /** Dataset name for breadcrumb */
  datasetName: string;
}

/**
 * Build a full URL for a node
 */
function buildNodeUrl(datasetId: string, nodeId: string): string {
  return `${PRODUCTION_BASE_URL}/#/${datasetId}/node/${nodeId}`;
}

/**
 * Generate Person schema for person nodes
 */
function generatePersonSchema(node: PersonNode, datasetId: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': buildNodeUrl(datasetId, node.id),
    name: node.title,
  };

  if (node.shortDescription) {
    schema.description = node.shortDescription;
  }

  if (node.biography) {
    schema.description = node.biography;
  }

  if (node.dateStart) {
    schema.birthDate = node.dateStart;
  }

  if (node.dateEnd) {
    schema.deathDate = node.dateEnd;
  }

  if (node.nationality) {
    schema.nationality = node.nationality;
  }

  if (node.imageUrl) {
    schema.image = node.imageUrl;
  }

  if (node.occupations && node.occupations.length > 0) {
    schema.jobTitle = node.occupations.join(', ');
  }

  if (node.alternateNames && node.alternateNames.length > 0) {
    schema.alternateName = node.alternateNames;
  }

  // Add external links as sameAs
  if (node.externalLinks && node.externalLinks.length > 0) {
    schema.sameAs = node.externalLinks.map((link) => link.url);
  }

  return schema;
}

/**
 * Generate CreativeWork schema for object nodes
 */
function generateCreativeWorkSchema(node: ObjectNode, datasetId: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': buildNodeUrl(datasetId, node.id),
    name: node.title,
  };

  if (node.shortDescription) {
    schema.description = node.shortDescription;
  }

  if (node.dateCreated || node.dateStart) {
    schema.dateCreated = node.dateCreated || node.dateStart;
  }

  if (node.language) {
    schema.inLanguage = node.language;
  }

  if (node.imageUrl) {
    schema.image = node.imageUrl;
  }

  if (node.objectType) {
    schema.additionalType = node.objectType;
  }

  if (node.subject) {
    schema.about = node.subject;
  }

  // Note: creators are node IDs, we'd need to resolve them to names
  // For now, we skip creator linking to avoid complexity

  if (node.externalLinks && node.externalLinks.length > 0) {
    schema.sameAs = node.externalLinks.map((link) => link.url);
  }

  return schema;
}

/**
 * Generate Place schema for location nodes
 */
function generatePlaceSchema(node: LocationNode, datasetId: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': buildNodeUrl(datasetId, node.id),
    name: node.title,
  };

  if (node.shortDescription) {
    schema.description = node.shortDescription;
  }

  if (node.country) {
    schema.addressCountry = node.country;
  }

  if (node.coordinates) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: node.coordinates.lat,
      longitude: node.coordinates.lng,
    };
  }

  if (node.imageUrl) {
    schema.image = node.imageUrl;
  }

  if (node.locationType) {
    schema.additionalType = node.locationType;
  }

  if (node.externalLinks && node.externalLinks.length > 0) {
    schema.sameAs = node.externalLinks.map((link) => link.url);
  }

  return schema;
}

/**
 * Generate Organization schema for entity nodes
 */
function generateOrganizationSchema(node: EntityNode, datasetId: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': buildNodeUrl(datasetId, node.id),
    name: node.title,
  };

  if (node.shortDescription) {
    schema.description = node.shortDescription;
  }

  if (node.dateStart) {
    schema.foundingDate = node.dateStart;
  }

  if (node.dateEnd) {
    schema.dissolutionDate = node.dateEnd;
  }

  if (node.imageUrl) {
    schema.image = node.imageUrl;
  }

  if (node.entityType) {
    schema.additionalType = node.entityType;
  }

  // Note: foundedBy and headquarters are node IDs, would need resolution
  // For now, we skip to avoid complexity

  if (node.externalLinks && node.externalLinks.length > 0) {
    schema.sameAs = node.externalLinks.map((link) => link.url);
  }

  return schema;
}

/**
 * Generate ItemPage wrapper schema
 */
function generateItemPageSchema(
  mainEntitySchema: Record<string, unknown>,
  datasetId: string,
  nodeId: string,
  datasetName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': buildNodeUrl(datasetId, nodeId),
    name: mainEntitySchema.name,
    description: mainEntitySchema.description,
    mainEntity: {
      '@id': mainEntitySchema['@id'],
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Scenius',
      url: PRODUCTION_BASE_URL,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: PRODUCTION_BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: datasetName,
          item: `${PRODUCTION_BASE_URL}/#/?dataset=${encodeURIComponent(datasetId)}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: mainEntitySchema.name as string,
          item: buildNodeUrl(datasetId, nodeId),
        },
      ],
    },
  };
}

/**
 * Generate appropriate schema based on node type
 */
function generateMainEntitySchema(
  node: GraphNode,
  datasetId: string
): Record<string, unknown> {
  if (isPersonNode(node)) {
    return generatePersonSchema(node, datasetId);
  }
  if (isObjectNode(node)) {
    return generateCreativeWorkSchema(node, datasetId);
  }
  if (isLocationNode(node)) {
    return generatePlaceSchema(node, datasetId);
  }
  // EntityNode is the only remaining type
  return generateOrganizationSchema(node, datasetId);
}

/**
 * SchemaOrg component - renders JSON-LD structured data for a node
 */
function SchemaOrg({ node, datasetId, datasetName }: SchemaOrgProps) {
  const mainEntitySchema = generateMainEntitySchema(node, datasetId);

  const itemPageSchema = generateItemPageSchema(
    mainEntitySchema,
    datasetId,
    node.id,
    datasetName
  );

  return (
    <Helmet>
      {/* Main entity schema (Person, CreativeWork, Place, or Organization) */}
      <script type="application/ld+json">{JSON.stringify(mainEntitySchema)}</script>
      {/* ItemPage wrapper with breadcrumb */}
      <script type="application/ld+json">{JSON.stringify(itemPageSchema)}</script>
    </Helmet>
  );
}

export default SchemaOrg;
