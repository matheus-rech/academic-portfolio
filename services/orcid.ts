
export async function fetchOrcidData(orcidId: string) {
  try {
    const response = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/works`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) throw new Error('ORCID fetch failed');
    const data = await response.json();
    
    if (!data.group) return [];

    // Grouped works extraction
    return data.group.map((g: any) => {
      // Each group may contain multiple 'versions' of the same work
      const work = g['work-summary']?.[0] || {};
      
      const year = work['publication-date']?.year?.value || 'N/A';
      const month = work['publication-date']?.month?.value || '';
      const day = work['publication-date']?.day?.value || '';
      
      const externalIds = work['external-ids']?.['external-id'] || [];
      const doiId = externalIds.find((id: any) => id['external-id-type'] === 'doi');
      const pmidId = externalIds.find((id: any) => id['external-id-type'] === 'pmid');

      return {
        title: work.title?.title?.value || 'Untitled',
        journal: work['journal-title']?.value || 'N/A',
        year: year,
        date: `${year}${month ? '-' + month : ''}${day ? '-' + day : ''}`,
        type: work.type || 'Other',
        doi: doiId?.['external-id-value'],
        pmid: pmidId?.['external-id-value'],
        url: work.url?.value,
        lastModified: work['last-modified-date']?.value
      };
    });
  } catch (error) {
    console.error('Error fetching ORCID data:', error);
    return null;
  }
}
