interface ScanResult {
  apis: {
    path: string;
    method: string;
    description?: string;
  }[];
  databases: {
    name: string;
    type: string;
    tables: string[];
  }[];
}

export async function scanBackend(baseUrl: string): Promise<ScanResult> {
  try {
    // Attempt to fetch API documentation
    const apiResponse = await fetch(`${baseUrl}/api-docs`);
    const dbResponse = await fetch(`${baseUrl}/db-info`);
    
    if (!apiResponse.ok || !dbResponse.ok) {
      throw new Error('Failed to fetch backend information');
    }

    const apiData = await apiResponse.json();
    const dbData = await dbResponse.json();

    return {
      apis: apiData,
      databases: dbData
    };
  } catch (error) {
    console.error('Backend scanning failed:', error);
    return {
      apis: [],
      databases: []
    };
  }
}
