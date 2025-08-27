// Performance Optimization Verification Script
class PerformanceOptimizationVerifier {
  constructor() {
    this.metrics = {};
    this.tests = [];
    this.init();
  }

  init() {
    console.log('🚀 Starting Performance Optimization Verification...');
    this.runAllTests();
  }

  async runAllTests() {
    try {
      await this.testDebouncedRendering();
      await this.testFontLoadingOptimization();
      await this.testCanvasPerformance();
      await this.testMemoryUsage();
      await this.testValidationPerformance();
      await this.testResponsivePerformance();
      
      this.generateReport();
    } catch (error) {
      console.error('❌ Performance testing failed:', error);
    }
  }

  async testDebouncedRendering() {
    console.log('🎯 Testing debounced rendering...');
    
    if (!window.app || typeof window.app.renderPreview !== 'function') {
      this.addTest('Debounced Rendering', false, 'App not available for testing');
      return;
    }

    const startTime = performance.now();
    let renderCount = 0;
    
    // Override renderPreview to count calls
    const originalRender = window.app.renderPreview;
    window.app.renderPreview = function() {
      renderCount++;
      return originalRender.call(this);
    };

    // Simulate rapid input changes
    const iterations = 50;
    for (let i = 0; i < iterations; i++) {
      window.app.renderPreview();
      if (i % 10 === 0) {
        await this.sleep(1); // Small delay to allow debouncing
      }
    }

    // Wait for debounced calls to complete
    await this.sleep(100);

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Restore original function
    window.app.renderPreview = originalRender;

    // Debouncing should reduce the number of actual render calls
    const debounceEfficiency = (iterations - renderCount) / iterations;
    const passed = renderCount < iterations && debounceEfficiency > 0.5;

    this.metrics.debouncedRendering = {
      inputCalls: iterations,
      actualRenders: renderCount,
      efficiency: debounceEfficiency,
      duration: duration
    };

    this.addTest('Debounced Rendering', passed, 
      `${iterations} input calls → ${renderCount} renders (${(debounceEfficiency * 100).toFixed(1)}% reduction)`);
  }

  async testFontLoadingOptimization() {
    console.log('🔤 Testing font loading optimization...');
    
    const tests = {
      fontDisplaySwap: false,
      fontLoadingAPI: false,
      fallbackFonts: false
    };

    // Test font-display: swap in CSS
    try {
      const stylesheets = Array.from(document.styleSheets);
      let foundFontDisplay = false;
      
      for (const stylesheet of stylesheets) {
        try {
          const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
          for (const rule of rules) {
            if (rule.style && rule.style.fontDisplay === 'swap') {
              foundFontDisplay = true;
              break;
            }
          }
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      }
      
      tests.fontDisplaySwap = foundFontDisplay;
    } catch (error) {
      console.warn('Could not check font-display property:', error);
    }

    // Test Font Loading API usage
    tests.fontLoadingAPI = !!(document.fonts && document.fonts.ready);

    // Test fallback font configuration
    if (window.CONFIG && window.CONFIG.canvas && window.CONFIG.canvas.fonts) {
      tests.fallbackFonts = !!(window.CONFIG.canvas.fonts.fallback);
    }

    const passedTests = Object.values(tests).filter(Boolean).length;
    const totalTests = Object.keys(tests).length;
    const passed = passedTests >= 2; // At least 2 out of 3 optimizations

    this.metrics.fontOptimization = tests;

    this.addTest('Font Loading Optimization', passed,
      `${passedTests}/${totalTests} optimizations: ${Object.entries(tests)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ')}`);
  }

  async testCanvasPerformance() {
    console.log('🎨 Testing canvas performance...');
    
    if (!window.app || typeof window.app.performRender !== 'function') {
      this.addTest('Canvas Performance', false, 'Canvas rendering not available for testing');
      return;
    }

    const iterations = 100;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      try {
        window.app.performRender();
        const endTime = performance.now();
        times.push(endTime - startTime);
      } catch (error) {
        console.warn(`Render ${i} failed:`, error);
      }
      
      // Small delay to prevent overwhelming the browser
      if (i % 20 === 0) {
        await this.sleep(1);
      }
    }

    if (times.length === 0) {
      this.addTest('Canvas Performance', false, 'No successful renders');
      return;
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    const fps = 1000 / avgTime;

    // Performance targets
    const targetFPS = 30; // Minimum acceptable FPS
    const targetAvgTime = 1000 / targetFPS; // 33.33ms
    
    const passed = avgTime < targetAvgTime && fps >= targetFPS;

    this.metrics.canvasPerformance = {
      avgTime: avgTime,
      maxTime: maxTime,
      minTime: minTime,
      fps: fps,
      iterations: times.length
    };

    this.addTest('Canvas Performance', passed,
      `Avg: ${avgTime.toFixed(2)}ms, FPS: ${fps.toFixed(1)}, Range: ${minTime.toFixed(2)}-${maxTime.toFixed(2)}ms`);
  }

  async testMemoryUsage() {
    console.log('💾 Testing memory usage...');
    
    if (!performance.memory) {
      this.addTest('Memory Usage', true, 'Performance.memory API not available (not a failure)');
      return;
    }

    const initialMemory = performance.memory.usedJSHeapSize;
    
    // Simulate heavy usage
    const iterations = 200;
    for (let i = 0; i < iterations; i++) {
      if (window.app && typeof window.app.renderPreview === 'function') {
        window.app.renderPreview();
      }
      
      // Create some temporary objects to test garbage collection
      const tempData = new Array(1000).fill(0).map((_, idx) => ({
        id: idx,
        data: `test-data-${idx}`,
        timestamp: Date.now()
      }));
      
      if (i % 50 === 0) {
        await this.sleep(10);
      }
    }

    // Force garbage collection if available (Chrome with --enable-precise-memory-info)
    if (window.gc) {
      window.gc();
    }

    // Wait for potential garbage collection
    await this.sleep(100);

    const finalMemory = performance.memory.usedJSHeapSize;
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseKB = memoryIncrease / 1024;

    // Memory increase should be reasonable (less than 5MB for this test)
    const maxAcceptableIncrease = 5 * 1024 * 1024; // 5MB
    const passed = memoryIncrease < maxAcceptableIncrease;

    this.metrics.memoryUsage = {
      initial: initialMemory,
      final: finalMemory,
      increase: memoryIncrease,
      increaseKB: memoryIncreaseKB
    };

    this.addTest('Memory Usage', passed,
      `Memory increase: ${memoryIncreaseKB.toFixed(2)}KB (${(memoryIncrease / 1024 / 1024).toFixed(2)}MB)`);
  }

  async testValidationPerformance() {
    console.log('✅ Testing validation performance...');
    
    if (!window.app) {
      this.addTest('Validation Performance', false, 'App not available for testing');
      return;
    }

    const validationFunctions = [
      'validateSpeakerName',
      'validateTopicTitle', 
      'validateSpeakerBio',
      'validateDateInput',
      'validateTimeInput',
      'validateSelectInput'
    ];

    const testData = {
      validateSpeakerName: 'John Doe',
      validateTopicTitle: 'Building Scalable Applications with AWS',
      validateSpeakerBio: 'John is a senior software engineer with 10+ years of experience in cloud computing.',
      validateDateInput: '2025-03-15',
      validateTimeInput: '14:30',
      validateSelectInput: 'Virtual'
    };

    let totalValidations = 0;
    let totalTime = 0;
    let successfulValidations = 0;

    for (const funcName of validationFunctions) {
      if (typeof window.app[funcName] === 'function') {
        const testValue = testData[funcName];
        const iterations = 1000;
        
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
          try {
            window.app[funcName](testValue);
            successfulValidations++;
          } catch (error) {
            console.warn(`Validation ${funcName} failed:`, error);
          }
          totalValidations++;
        }
        
        const endTime = performance.now();
        totalTime += (endTime - startTime);
      }
    }

    const avgValidationTime = totalValidations > 0 ? totalTime / totalValidations : 0;
    const successRate = totalValidations > 0 ? successfulValidations / totalValidations : 0;
    
    // Validation should be fast (< 0.1ms per validation on average)
    const targetTime = 0.1;
    const passed = avgValidationTime < targetTime && successRate > 0.95;

    this.metrics.validationPerformance = {
      totalValidations: totalValidations,
      successfulValidations: successfulValidations,
      avgTime: avgValidationTime,
      successRate: successRate,
      totalTime: totalTime
    };

    this.addTest('Validation Performance', passed,
      `Avg: ${avgValidationTime.toFixed(3)}ms per validation, Success rate: ${(successRate * 100).toFixed(1)}%`);
  }

  async testResponsivePerformance() {
    console.log('📱 Testing responsive performance...');
    
    const startTime = performance.now();
    
    // Test layout recalculation performance
    const originalWidth = document.body.style.width;
    const widths = ['320px', '768px', '1024px', '1200px', '1920px'];
    
    let layoutTimes = [];
    
    for (const width of widths) {
      const layoutStart = performance.now();
      
      // Force layout recalculation
      document.body.style.width = width;
      document.body.offsetHeight; // Force reflow
      
      const layoutEnd = performance.now();
      layoutTimes.push(layoutEnd - layoutStart);
      
      await this.sleep(10); // Small delay between tests
    }
    
    // Restore original width
    document.body.style.width = originalWidth;
    
    const avgLayoutTime = layoutTimes.reduce((a, b) => a + b, 0) / layoutTimes.length;
    const maxLayoutTime = Math.max(...layoutTimes);
    
    // Layout recalculation should be fast (< 5ms on average)
    const targetLayoutTime = 5;
    const passed = avgLayoutTime < targetLayoutTime;
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;

    this.metrics.responsivePerformance = {
      avgLayoutTime: avgLayoutTime,
      maxLayoutTime: maxLayoutTime,
      layoutTimes: layoutTimes,
      totalTime: totalTime
    };

    this.addTest('Responsive Performance', passed,
      `Avg layout time: ${avgLayoutTime.toFixed(2)}ms, Max: ${maxLayoutTime.toFixed(2)}ms`);
  }

  addTest(name, passed, details) {
    const test = { name, passed, details, timestamp: new Date().toISOString() };
    this.tests.push(test);
    
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${name}: ${details}`);
  }

  generateReport() {
    console.log('\n📊 Performance Optimization Report');
    console.log('=====================================');
    
    const passedTests = this.tests.filter(t => t.passed).length;
    const totalTests = this.tests.length;
    const successRate = (passedTests / totalTests) * 100;
    
    console.log(`Overall Score: ${passedTests}/${totalTests} (${successRate.toFixed(1)}%)`);
    console.log('');
    
    // Detailed results
    this.tests.forEach(test => {
      const status = test.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.name}`);
      console.log(`   ${test.details}`);
    });
    
    console.log('\n📈 Performance Metrics:');
    console.log('========================');
    
    if (this.metrics.debouncedRendering) {
      const dr = this.metrics.debouncedRendering;
      console.log(`Debounced Rendering: ${dr.efficiency * 100}% efficiency (${dr.inputCalls} → ${dr.actualRenders})`);
    }
    
    if (this.metrics.canvasPerformance) {
      const cp = this.metrics.canvasPerformance;
      console.log(`Canvas Performance: ${cp.fps.toFixed(1)} FPS average (${cp.avgTime.toFixed(2)}ms per frame)`);
    }
    
    if (this.metrics.memoryUsage) {
      const mu = this.metrics.memoryUsage;
      console.log(`Memory Usage: ${mu.increaseKB.toFixed(2)}KB increase during testing`);
    }
    
    if (this.metrics.validationPerformance) {
      const vp = this.metrics.validationPerformance;
      console.log(`Validation Performance: ${vp.avgTime.toFixed(3)}ms average per validation`);
    }
    
    if (this.metrics.responsivePerformance) {
      const rp = this.metrics.responsivePerformance;
      console.log(`Responsive Performance: ${rp.avgLayoutTime.toFixed(2)}ms average layout time`);
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    console.log('===================');
    
    if (successRate >= 90) {
      console.log('🎉 Excellent performance! All optimizations are working well.');
    } else if (successRate >= 70) {
      console.log('👍 Good performance with room for improvement.');
    } else {
      console.log('⚠️  Performance needs attention. Consider reviewing failed tests.');
    }
    
    const failedTests = this.tests.filter(t => !t.passed);
    if (failedTests.length > 0) {
      console.log('\nFailed tests to address:');
      failedTests.forEach(test => {
        console.log(`- ${test.name}: ${test.details}`);
      });
    }
    
    // Export results for external use
    window.performanceTestResults = {
      tests: this.tests,
      metrics: this.metrics,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: successRate
      }
    };
    
    console.log('\n📋 Results exported to window.performanceTestResults');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined') {
  // Wait for DOM and app to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => new PerformanceOptimizationVerifier(), 1000);
    });
  } else {
    setTimeout(() => new PerformanceOptimizationVerifier(), 1000);
  }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizationVerifier;
}