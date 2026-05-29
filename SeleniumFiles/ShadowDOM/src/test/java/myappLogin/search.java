package myappLogin;

import org.openqa.selenium.By;
import org.openqa.selenium.SearchContext;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.edge.EdgeDriver;
import org.testng.Assert;
import org.testng.annotations.Test;



public class search {
	
	WebDriver driver;
	
	@Test
	
	void searchHP() throws Exception {
	driver = new EdgeDriver ();
	driver.get("http://localhost:3000/");
	Thread.sleep(3000);
	WebElement shadowHost= driver.findElement(By.cssSelector("div[title='Shadow Host Element']"));
	SearchContext shadowroot = shadowHost.getShadowRoot();
	WebElement Searchbox= shadowroot.findElement(By.cssSelector("input[placeholder^='Search by title']"));
	Searchbox.sendKeys("The Hobbit");
	WebElement Submit=shadowroot.findElement(By.cssSelector("button"));
	Submit.click();
	Thread.sleep(3000);
	
	// Assert the result title
    WebElement result = driver.findElement(By.xpath("//strong[text()='The Hobbit']"));
    Assert.assertEquals(result.getText(), "The Hobbit","Expected 'The Hobbit' but got: " + result.getText());

    System.out.println("Test passed — found: " + result.getText());
    
	driver.quit();
	
	}
	

}
